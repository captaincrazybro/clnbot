const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI');
const _Player = require('../../util/Constructors/_Player');
var blacklist = require("../../storage/blacklist.json");
const Discord = require("discord.js");
const _Blacklist = require('../../util/Constructors/_Blacklist');
const _League = require('../../util/Constructors/_League')

module.exports.run = async (bot, message, args, cmd) => {

    let settings = require('../../settings.json');
    if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a league set! Use the " + settings.prefix + "setleague command to set the guild's league").send(message.channel);

    let league = _League.getLeague(message.guild.id) 
    blacklist = _Blacklist.blacklists(league);

    let list = ""; 
    blacklist.forEach(val => {
        console.log(val)
        if (!val.uuid) return; 
        let player = _Player.getPlayerUuid(val.uuid, league); 
        if (!player) player = _Player.addPlayer(val.name, val.uuid, league); 

        list += `${player.name.replace(/_/g, "\\_")}\n`;
        // - Referee: ${val.referee} - Date: ${val.start_date}
    })

    if (blacklist.length == 0) return new _NoticeEmbed(Colors.ERROR, "There are currently no active blacklists").send(message.channel);

    let embed = new Discord.MessageEmbed()
        .setColor(Colors.ERROR)
        .setTitle("Blacklists")
        .setDescription(list);

    message.channel.send(embed);

}

module.exports.help = {
    name: "blacklists",
    aliases: ["list-blacklists", "listblacklists"],
    permission: Groups.DEFAULT,
    description: "Lists all the blacklists",
    usage: "blacklists"
}
