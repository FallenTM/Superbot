
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
const prefix = "!";
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldnt find commands.");
    return;
  }
  jsfile.forEach((f, i) => {
    let props = require('./commands/' + f);
    console.log(f + " loaded!");
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", function(){
  console.log('Superbot is online!');
  bot.user.setActivity("with code.");
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(bot, message, args);
});

bot.login(process.env.TOKEN);
