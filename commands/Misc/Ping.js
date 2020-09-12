const Groups = require('../../util/Enums/Groups')

module.exports.run = async (bot,message,args,cmd) => {

    if(cmd.includes("ping")){
        message.channel.send("Pong!");
    } else {
        message.channel.send("Ping!");
    }

}

module.exports.help = {
    name: "ping",
    aliases: ["pong"],
    permission: Groups.DEFAULT,
    description: "Pings the bot",
    usage: "ping"
}