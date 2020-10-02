const fetch = require("node-fetch");
const path = require("path");
require('dotenv').config();
const github_access_token = process.env.github_access_token;
const repos = [
  // ここに監視対象のレポジトリを記載する
]
const base_url = "";

async function getPulls(repos) {
  const options = {
    method: "GET",
    headers:
    {
      "cache-control": "no-cache",
      Connection: "keep-alive",
      "Accept-Encoding": "gzip, deflate",
      Host: "api.github.com",
    }
  };
  const responses = await Promise.all(repos.map(async repo => {
    const url = `${base_url}/${repo}/pulls?access_token=${github_access_token}&state=open`;
    const result = await (await fetch(url, options)).json();
    if (!result || result.length == 0) { return }
    const temp =  result.map(v => ({ repo, title: v.title, url: v.html_url, number: v.number }));
    return temp;
  }));
  return responses.flat().filter(v => v !== undefined);
}

module.exports = async robot => {
  robot.respond(/PR|レビュー|review/i, async (msg) => {
    let pulls = await getPulls(repos);
    if (msg.message.text.match(/レビュー|review/)) {
      pulls = pulls.filter(v => !v.title.toLowerCase().match(/wip/));
    }
    const attachments = pulls.map(l => {
      if (!l) { return }
      return {
        "color": "#36a64f",
        "title": `${l.repo}: #${l.number} ${l.title}`,
        "title_link": l.url
      }
    });
    msg.send({ attachments });
  });
};

