const room = process.env.BOT_ROOM;
const SLACK_URL = process.env.SLACK_URL;
module.exports = async robot => {
  let users = robot.brain.data.users;
  robot.hear(/((い|生)きてる?(\?|？))/i, async msg => {
    msg.send(":ok_woman:");
  });
  robot.hear(/ぐっもに/i, async msg => {
    msg.send(`G${Array(Math.floor(Math.random() * 20) + 1).fill("o").join("")}d M${Array(Math.floor(Math.random() * 20) + 1).fill("o").join("")}rning${Array(Math.floor(Math.random() * 20)).fill("!").join("")}`);
  });
  robot.adapter.client.on('raw_message', async msg => {
    if (users == null) {
      users = robot.brain.data.users;
    }
    const convert = JSON.parse(msg);
    if (convert.type == "emoji_changed") {
      if (convert.subtype == "add") {
        robot.send({ room }, "", { attachments: [{ pretext: `また \`:${convert.name}:\` っていうemojiが追加されたっぽい :${convert.name}:`, image_url: convert.value }] });
      } else if (convert.subtype == "remove") {
        convert.names.forEach(name => robot.send({ room }, `${name}っていうemojiが消えた`));
      }
    } else if (convert.type == "channel_created") {
      const user = robot.adapter.client.rtm.dataStore.getUserById(convert.channel.creator);
      robot.send({ room }, `${user ? user.name : convert.channel.creator}さんが<#${convert.channel.id}|${convert.channel.name}>っていうチャンネルをつくった`)
    } else if (convert.type == "channel_rename") {
      const channel = robot.adapter.client.rtm.dataStore.getChannelById(convert.channel.id);
      robot.send({ room }, `#${channel.name} が <#${convert.channel.id}|${convert.channel.name}> って名前にかわったよ〜〜〜`);
    } else if (convert.type == "channel_archive") {
      const channel = robot.adapter.client.rtm.dataStore.getChannelById(convert.channel);
      robot.send({ room }, `:rip: <#${convert.channel}|${channel.name}> が闇に葬られた :rip:`);
    } else if (convert.type == "channel_unarchive") {
      robot.send({ room }, `<#${convert.channel}> を再構築！`);
    } else if (convert.type == "channel_updated" && convert.updates.is_private) {
      const channel = robot.adapter.client.rtm.dataStore.getChannelById(convert.channel);
      robot.send({ room }, `<#${convert.channel}|${channel.name}> の気配が消えた...`);
    } else if (convert.type == "team_join") {
      if (convert.user.is_bot) {
        if (convert.user.is_workflow_bot) {
          robot.send({ room }, `はい、${convert.user.real_name}というワークフローが作成された`);
        } else {
          robot.send({ room }, `あー、${convert.user.name}というbotが生み出された`);
        }
      } else {
        robot.send({ room }, `:tada: ${convert.user.real_name}さんがjoinしました :tada:`);
      }
    } else if (convert.type === "apps_installed") {
      if (convert.is_workflow_bot) {
        robot.send({ room }, `${convert.app.name}ってワークフローを設定`);
      } else {
        robot.send({ room }, `<${SLACK_URL}/apps/${convert.app.id}|${convert.app.name}>ってアプリをインストゥロール！`);
      }
    } else if (convert.type == "hello") {
      // robot.send({ room }, `ぐっもに`);
    } else if (convert.type === "subteam_created") {
      robot.send({ room }, `@${convert.subteam.name}軍団が結成された！`);
    }
  });
};