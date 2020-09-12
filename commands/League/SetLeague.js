const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(bot.guilds.get(message.guild.id).members.get(message.author.id).hasPermission('ADMINISTRATOR')) return new _NoticeEmbed(Colors.ERROR, "Only server admins can execute this command").send(message.channel);

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a league").send(message.channel);

    let leagueName = args[0];
    var league;

    if(leagueName.toLowerCase() == "twl" || leagueName.toLowerCase() == "twlleague") league = "twl";
    else if(leagueName.toLowerCase() == "ctfcl" || leagueName.toLowerCase() == "ctfclleague") league = "ctfcl";
    else return new _NoticeEmbed(Colors.ERROR, "Invalid leauge - Please specify a valid league").send(message.channel);

    _League.setLeague(message.guild.id, league);

    new _NoticeEmbed(Colors.SUCCESS, "You have successfully set this guild's league to " + league);


}

module.exports.help = {
    name: "setleague",
    aliases: ["set-league", "registerleague", "register-league"],
    permission: Groups.DEFAULT,
    description: "Sets the league of the discord",
    usage: "setleague <league>"
}