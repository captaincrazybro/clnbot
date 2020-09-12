const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a guild set! Use the " + settings.prefix + "setleague command to set the league's guild").send(message.channel);

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team name").send(message.channel);

    let teamName = args[0];

    let team = _Team.getTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid name - This team does not exist").send(message.channel);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a tier").send(message.channel);

    let wins = args[1];

    if(args.length == 2) return new _NoticeEmbed(Colors.WARN, "Please specify a rank").send(message.channel);

    let losses = args[2];

    team.setWins(wins);
    team.setLosses(losses);

    new _NoticeEmbed(Colors.SUCCESS, `Successfully set ${team.name}'s score to tier ${wins} and rank ${losses}`).send(message.channel);

    return;

}

module.exports.help = {
    name: "setranking",
    aliases: ["set-ranking"],
    permission: Groups.MOD,
    description: "Sets score for a team",
    usage: "setranking <team> <tier> <rank>"
}
