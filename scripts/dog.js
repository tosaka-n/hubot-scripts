// const fetch = require("node-fetch");
// const imgUrl = "https://api.thedogapi.com/v1/images/search?format=json";
// async function fetchURL() {
//   return (await (await fetch(imgUrl)).json())[0].url;
// }

// module.exports = async robot => {
//   robot.respond(/dog/i, async (msg) => {
//     const img = await fetchURL();
//     msg.send({attachments : [{pretext: "bowwow", image_url: img}]});
//   });
// };

function test(a, b) {
  if (b == 0) {
    console.log('tse')
    return 0;
  } else {
    x = b
    y = a % b;
    return test(x, y)
  }
}
hoge = test(5, 2)
console.log(hoge)