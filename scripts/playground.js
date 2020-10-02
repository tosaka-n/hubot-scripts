const fetch = require("node-fetch");
module.exports = async robot => {
  let users = robot.brain.data.users;
  robot.hear(/.テクスチャ\d/i, async (msg) => {
    const [emoji, numStr] = msg.message.text.split(/テクスチャ/);
    const texture = Array(Number(numStr)).fill(Array(Number(numStr)).fill(emoji).join("")).join("\n")
    msg.send(`${texture}`);
  });
  robot.hear(/BTC|btc/i, async (msg) => {
    const btc_jpy = "https://api.bitflyer.jp/v1/ticker?product_code=BTC_JPY";
    const status = await (await fetch(btc_jpy)).json();
    const result = ((status.best_bid + status.best_ask) / 2);
    msg.send(`1BTC = ${(Math.floor(result).toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,'))} JPY`);
  });
  robot.respond(/fox/i, async (msg) => {
    const link = (await (await fetch("https://randomfox.ca/floof/")).json());
    msg.send({attachments : [{pretext: "こゃーん", image_url: link.image}]});
  });
};
