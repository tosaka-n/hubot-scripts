const fetch = require('node-fetch');
const weather = {
  '100': ':sunny:',
  '200': ':cloud:',
  '300': ':umbrella_with_rain_drops:'
};
const pressure_level_txt = [
  'OK',
  'OK',
  'やや注意',
  '注意',
  '警戒'
];
function shuffle(arr) {
  const middle = Math.floor(arr.length / 2);
  const result = [];
  [...Array(middle + 1).keys()].forEach((v, i) => {
    if (i === middle && arr.length % 2) result.push(arr[arr.length - 1])
    if (i < middle) {
      result.push(arr[i])
      result.push(arr[middle + i])
    }
    console.log({ result })
  })
  return result;
}
module.exports = async robot => {
  robot.hear(/ずつーる|ズツール/i, async (msg) => {
    const response = await fetch('https://zutool.jp/api/getweatherstatus/13109');
    const json = await response.json()
    const now = new Date();
    let hours = now.getHours();
    if (hours > 12) { hours - 12 }
    hours += 9;

    const today = json.today.filter(v => parseInt(v.time) > hours).map(v => ({
      title: `${('00' + v.time).substr(-2, 2)}時`,
      value: `${parseFloat(v.temp).toFixed(1)}℃ ${weather[v.weather]} ${v.pressure}hPa ${pressure_level_txt[v.pressure_level]}`,
      short: true
    }));
    const tomorrow = json.tommorow.filter(v => parseInt(v.time) <= hours).map(v => ({
      title: `${('00' + v.time).substr(-2, 2)}時`,
      value: `${parseFloat(v.temp).toFixed(1)}℃ ${weather[v.weather]} ${v.pressure}hPa ${pressure_level_txt[v.pressure_level]}`,
      short: true
    }));
    const fields = shuffle(today.concat(tomorrow));
    msg.send({ attachments: [{ title: '頭痛情報', fields }] });
  });
};