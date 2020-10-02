function choice(fortunes) {
  const hit = rand(1, fortunes.reduce((a, c) => a += c.probability, 0));
  return lottery(fortunes, hit);
}

function lottery(fortunes, hit) {
  let area = 0;
  for (let fortune of fortunes) {
    area += fortune.probability;
    if (area >= hit) {
      return fortune.omikuji;
    }
  };
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const fortunes = [
  { omikuji: "【大吉】", probability: 5 },
  { omikuji: "【中吉】", probability: 5 },
  { omikuji: "【小吉】", probability: 3 },
  { omikuji: "【吉】", probability: 4 },
  { omikuji: "【末吉】", probability: 2 },
  { omikuji: "【凶】", probability: 3 },
  { omikuji: "【大凶】", probability: 1 },
  { omikuji: "【ぴょん吉】", probability: 1 },
  { omikuji: "【だん吉】", probability: 1 }
];

function otoshidama() {
  return `【${rand(0, 5000)}円】`;
}

module.exports = async robot => {
  robot.hear(/!omikuji/i, msg => {
    msg.send(choice(fortunes));
  });
  robot.hear(/!dama/i, msg => {
    msg.send(otoshidama());
  });
}

