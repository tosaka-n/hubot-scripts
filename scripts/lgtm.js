const fetch = require("node-fetch");
const randomUrl = "https://lgtmoon.herokuapp.com/api/images/random";
function choiceFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
}
module.exports = function(robot) {
  robot.hear(/^LGTM$/i, async (msg) => {
    const data = await fetch(randomUrl);
    const json = await data.json()
    const imageUrl = choiceFromArray(json.images).url;
    msg.send({attachments : [{text: `![LGTM](${imageUrl})`, image_url: imageUrl}]});
  });
};

