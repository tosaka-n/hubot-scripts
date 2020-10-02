const fetch = require("node-fetch");
const util = require('util');
const fs = require('fs');
const streamPipeline = util.promisify(require('stream').pipeline);

function name(str) {
  return [ `${str}.jpg`, `https://static.tenki.jp/static-images/${str}/recent/pref-16-large.jpg`]
}
async function fetchURL(){
  const url = "https://weather.yahoo.co.jp/weather/13/";
  const options = {
    "method" : "GET"
  }
  const response = await ((await fetch(url, options))).text();
  return response.split("都道府県概況")[1].split("【関東甲信地方】")[0].replace(/<.*>|\s/g, "").replace(/。/g, "。\r\n");
}

async function download(path, url) {
  const file = await fetch(url);
  await streamPipeline(file.body, fs.createWriteStream(path))
}
module.exports = async robot => {
  robot.hear(/(天気|tenki)$/i, async (res) => {
    res.send(await fetchURL());
  });
  robot.hear(/(雨(降ってる)?(\?|？)|(天気)(どう|レーダー|図))$/i, async (res) => {
    res.send("ちょっとまって");
    const [tenkiImg, radar] = name("radar");
    await download(tenkiImg, radar);
    await robot.adapter.client.web.files.upload(tenkiImg, {
      file: fs.createReadStream(tenkiImg),
      channels: res.message.room
    });
  });
  robot.hear(/^雷(\?|？)?$/i, async (res) => {
    res.send("ちょっとまって");
    const [lidenImg, liden] = name("liden");
    await download(lidenImg, liden);
    await robot.adapter.client.web.files.upload(lidenImg, {
      file: fs.createReadStream(lidenImg),
      channels: res.message.room
    });
  });
};
