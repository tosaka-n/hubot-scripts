const fs = require('fs').promises;
const path = require('path');
const thisEmojiListFileName = 'emoji.json';
const cronJob  = require('cron').CronJob;
const room = 'bot_channel';

async function getNewEmolis(robot) {
  const emojilist = Object.keys((await robot.adapter.client.web.emoji.list()).emoji);
  const thisEmojiList = JSON.parse(await fs.readFile(path.join(__dirname, thisEmojiListFileName), 'utf8'));
  const newList = emojilist.length === thisEmojiList.length ? [] : emojilist.filter(e => !thisEmojiList.includes(e));
  return { emojilist, thisEmojiList, newList }
}
function splitEmo(emoArray) {
  const result = [];
  let temp = [];
  let inc = 0;
  for (const emo of emoArray) {
    inc += emo.length;
    temp.push(`:${emo}:`);
    if (inc > 5000) {
      result.push(temp);
      inc = 0;
      temp = [];
    }
  }
  result.push(temp);
  return result
}
module.exports = async robot => {
  robot.respond(/emolis/i, async (msg) => {
    const { emojilist, thisEmojiList, newList } = await getNewEmolis(robot);
    if (thisEmojiList.length < 1) {
      const textArray = splitEmo(newList);
      msg.send({ attachments: textArray.map(emostr => ({ text: emostr.join("") })) });
      return;
    }
    const text = newList.map(v => `:${v}:`).join("");
    console.log({text});
    msg.send({ attachments: [{ pretext: `追加されたemoji ${newList.length}個 計${emojilist.length}個`, text }] });
  });
  robot.respond(/\:.{1,}\:/i, async (msg) => {
    const emoji = msg.message.text.match(/\:.{1,}\:/i)[0].replace(/\:/g,"");
    if(emoji.length < 1 ) {
      return;
    }
    const emojilist = await robot.adapter.client.web.emoji.list();
    msg.send(emojilist.emoji[emoji] ? `\`:${emoji}:\` is ${emojilist.emoji[emoji]}` : `:${emoji}:はデフォルトemojiかも`);
  });
  const job = new cronJob({
    // 平日の19時
    cronTime: "00 00 19 * * 1-5",
    onTick: async () => {
      const { emojilist, thisEmojiList, newList } = await getNewEmolis(robot);
      if (thisEmojiList.length === 0 || emojilist.length !== thisEmojiList.length) {
        await fs.writeFile(path.join(__dirname, thisEmojiListFileName), JSON.stringify(emojilist));
      }
      if (newList.length === 0) {
        return;
      }
      robot.send({ room }, { attachments: [{ pretext: `追加されたemoji ${newList.length}個 計${emojilist.length}個` , text: newList.map(v => `:${v}:`).join("") }]});
    },
    start: true,
    timeZone: "Asia/Tokyo",
  });
  job.start();
};

