const Groups = require("../../util/Enums/Groups");
const _NoticeEmbed = require("../../util/Constructors/_NoticeEmbed");
const _Team = require("../../util/Constructors/_Team");
const Colors = require("../../util/Enums/Colors");
const _League = require("../../util/Constructors/_League.js");
const LeagueModel = require("../../util/Models/LeagueModel");

module.exports.run = async (bot, message, args, cmd) => {
  // let league = _League.getLeague(message.guild.id);
  let league = await LeagueModel.getLeagueByServerId(message.guild.id);

  if (league == null)
    return new _NoticeEmbed(
      Colors.INFO,
      "This guild does not have a league set"
    ).send(message.channel);
  else
    return new _NoticeEmbed(
      Colors.INFO,
      "This guild's league is set to " + league
    ).send(message.channel);
};

module.exports.help = {
  name: "getleague",
  aliases: ["get-league", "whatleague", "league"],
  permission: Groups.DEFAULT,
  description: "Get's this guild's league",
  usage: "getleauge",
};
