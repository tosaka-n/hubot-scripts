const reply = [
  "ふむふむ",
  "うんうん",
  "それで？",
  "わからない",
  "というと？",
  "なるほど",
  "そうだね",
  "本当に？",
];


function choiceFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
module.exports = async robot => {
  robot.hear(/.*/i, async (msg) => {
    msg.send(choiceFromArray(reply));
  });
};