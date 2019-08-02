const functions = require("firebase-functions");
const Telegraf = require("telegraf");
const apixu = require("apixu");

let config = require("./env.json");

if (Object.keys(functions.config()).length) {
  config = functions.config();
}

const apixuClient = new apixu.Apixu({
  apikey: config.service.apixu_key
});

const bot = new Telegraf(config.service.telegram_key);

bot.start(ctx => ctx.reply("Welcome"));

bot.on("text", ctx => {
  let query = ctx.update.message.text;
  apixuClient
    .current(query)
    .then(current =>
      ctx.reply(`The current weather in ${query} is ${current.current.temp_c}`)
    )
    .catch(err =>
      ctx.reply(
        `Sorry, did you type the city correctly. We got the folling ${err}`
      )
    );
});

bot.launch();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  apixuClient
    .current("Bangalore")
    .then(current => response.send(current))
    .catch(err => response.send(err));
});
