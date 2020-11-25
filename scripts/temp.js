const fetch = require("node-fetch");
const JSDOM = require('jsdom').JSDOM;
const values = ["time", "temp", "precipitation", "direction", "speed", "sunshine_hours", "humidity", "barometric_pressure"];
const val_ja = ["時刻", "気温", "降水量", "風向", "風速", "日照時間", "湿度", "気圧"];
const units = ["時", "℃", "mm", "", "m/s", "h", "%", "hPa"];
async function repro(url) {
  const response = await fetch(url);
  const text = await response.text();
  const dom = await JSDOM.fromURL(url)
  return dom.window.document;
}
function arr2obj(arr, key) {
  return arr.reduce((p, c) => ({ ...p, [c[key]]: c }), {})
}
async function getTemps() {
  const document = await repro('https://www.jma.go.jp/jp/amedas_h/today-44132.html');
  let time = new Date().getHours() + 2 + 9;
  if (new Date().getMinutes() < 10) { time--; }
  const result = Array.from(document.querySelectorAll(`#tbl_list > tbody > tr:nth-child(${time}) > td`)).map(v => v.innerHTML);
  if (result.length > 8) {
    values.splice(5, 0, "snowfall");
    val_ja.splice(5, 0, "積雪深");
    units.splice(5, 0, "mm");
  }
  const maps = result.map((p, i) => ({ value: values[i], amount: p, unit: units[i], ja: val_ja[i] }), {});
  return maps
}

module.exports = async robot => {
  robot.hear(/(お?外どう(\?|？))$/i, async (res) => {
    const maps = await getTemps();
    res.send(maps.map(v => `${v.ja}: ${v.amount}${v.unit}`).join("\n"));
  });
};

