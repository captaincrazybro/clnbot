const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')

module.exports.run = async (bot,message,args,cmd) => {

    let invite = `https://discordapp.com/oauth2/authorize?&client_id=${bot.user.id}&scope=bot&permissions=2147482871`

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setTitle(`<${invite}>`)

    message.channel.send(embed);

}

module.exports.help = {
    name: "invite",
    aliases: ["invitelink"],
    permission: Groups.DEFAULT,
    description: "Gets the invite link of the bot",
    usage: "invite"
}