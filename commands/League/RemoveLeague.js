const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(bot.guilds.get(message.guild.id).members.get(message.author.id).hasPermission('ADMINISTRATOR')) return new _NoticeEmbed(Colors.ERROR, "Only server admins can execute this command").send(message.channel);

    _League.resetLeague();

    new _NoticeEmbed(Colors.SUCCESS, "You have successfully removed this guild's league");


}

module.exports.help = {
    name: "removeleague",
    aliases: ["remove-league", "unsetleague", "unset-league"],
    permission: Groups.DEFAULT,
    description: "Unsets the league of the discord",
    usage: "removeleague"
}