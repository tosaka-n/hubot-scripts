const fetch = require("node-fetch");
const dJSON = require('dirty-json');

async function getMetro() {
  const unkoUrl = "https://www.tokyometro.jp/library/common/operation/status.json"
  const options = {
    method: "GET",
    headers:
    {
      "cache-control": "no-cache",
      Connection: "keep-alive",
      "Accept-Encoding": "gzip, deflate",
    }
  };
  const url = `${unkoUrl}?_=${new Date().getTime()}`;
  const result = await (await fetch(url, options)).text();
  const format = JSON.parse(result.replace(/operate_status_cb_func|\(|\)/g, ""));
  return format.jp.lines.map(v => `:metro_${v.name_alpha_db}: ${v.line_name.length === 3 ? v.line_name + "　" : v.line_name}: ${v.status == 0 ? v.status_info : v.contents.replace(/\<br\>/g, "").replace(/】/, "】\n")}`).join("\n");
}

async function getTokyu() {
  const tokyuJsonUrl = "https://www.tokyu.co.jp/unten/unten2.json";
  const lineArray = [
      { line: 'mg', emoji: ":tokyu_meguro:" },
      { line: 'om', emoji: ":tokyu_ooimachi:" },
      { line: 'tm', emoji: ":tokyu_tamagawa:" },
      { line: 'kd', emoji: ":tokyu_kodomonokuni:" },
      { line: 'ty', emoji: ":tokyu_touyoko:" },
      { line: 'dt', emoji: ":tokyu_denentoshi:" },
      { line: 'ik', emoji: ":tokyu_ikegami:" },
      { line: 'sg', emoji: ":tokyu_setagaya:" },
    ];
    const options = {
      method: "GET",
      headers:
      {
        "cache-control": "no-cache",
        Connection: "keep-alive",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json"
      }
    };
    const result = await fetch(tokyuJsonUrl, options);
    const text = await result.text();
    const r = dJSON.parse(text)
    let map = [];
    if (r.check === "1") {
      map = lineArray.map(v => v.emoji + " " + r[`unten_${v.line}`]);
      map.unshift(r['unten'].replace(/\<br\>/g, "\n"));
    } else {
      map.push(r['unten'].replace(/\<br\>/g, "\n"));
    }
    return map.join("\n");
}
module.exports = async robot => {
  robot.respond(/metro|メトロ/i, async (msg) => {
    msg.send(await getTokyu());
  });

  robot.respond(/tokyu|東急/i, async (msg) => {
    msg.send(await getTokyu());
  });
  robot.hear(/(unkou?)|運行(情報)?/i, async (msg) => {
    const tokyuInfo = await getTokyu()
    const metroInfo = await getMetro()
    msg.send(`${tokyuInfo}\n${metroInfo}`);
  });
};
