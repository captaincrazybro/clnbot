const Groups = require('../../util/Enums/Groups')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed');
const _Team  = require('../../util/Constructors/_Team')
const Colors = require('../../util/Enums/Colors')
const Discord = require('discord.js');
const _MinecraftApi = require('../../util/Constructors/_MinecraftAPI')
const ranks = require('../../storage/ranks.json')
const teams = require('../../storage/teams.json')
const _Player = require('../../util/Constructors/_Player');
const stringUtil = require('string-similarity');
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async (bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a guild set! Use the " + settings.prefix + "setleague command to set the league's guild").send(message.channel);

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a team").send(message.channel);

    let teamName = args[0];

    let team = getTeam(teamName);

    if(team == null) return new _NoticeEmbed(Colors.ERROR, "Invalid name - This team does not exist").send(message.channel);

        var membersArray = [];
        
        //_Player.updateNames()

        team.getMembers().forEach(val => {
            var member = "";
            member += `${val.name.replace(/_/g, "\\_")}`
            if(getRankOrNull(val.rank) != null && val.rank.toLowerCase() != "member") member += ` ${getRankOrNull(val.rank)}`
            if(val.rank2 != undefined) if(val.rank2.toLowerCase() != "none" && getRankOrNull(val.rank2) != null) member += ` ${getRankOrNull(val.rank2)}`
            membersArray.push(member);
        })

        membersArray.sort((a, b) => {
            return getRankOrder(a.split(" ")[1]) - getRankOrder(b.split(" ")[1]);
        })

        let members = membersArray.join("\n");
        
        if(membersArray.length == 0) members = "None";
        
        _MinecraftApi.getName(team.owner).then(val => {

            var owner;

            if(members == "") members = "None";

            if(val == null) owner = "None";
            else owner = val;
        
            var teamsSorted = teams;
            teamsSorted.sort((a, b) => { return (b.wins - b.losses) - (a.wins - a.losses) })
            var index;
            teamsSorted.forEach((val, i) => {
                if(val.name == team.name) index = i
            })

            let embed = new Discord.RichEmbed()
                .setColor(team.color)
                .setTitle(`${team.name}`)
                //.addField("Mentor", owner)
                //.addField("Nick", team.nick)
                .addField("Ranking", `Tier: ${team.wins} Rank: ${team.losses}`)
                .addField("Members", members)
                
            if(team.logo != "None") embed.setThumbnail(team.logo);

            message.channel.send(embed);
        
        })


    return;

}

function getTeam(team){
    
    var outcome = null;
    
    teams.forEach(val => {
        if(val.name.toLowerCase().includes(team.toLowerCase())) outcome = _Team.getTeam(val.name);
    });
    
    return outcome;
    
}

function getRankOrder(emoji){

    if(emoji == null) return 9;
    
    let outcome = null;

    ranks.forEach(val => {
        if(val.split("-")[1] == emoji) outcome = val.split("-")[2]
    })

    return outcome;
}

function getRankOrNull(rank){

    let outcome = null;

    ranks.forEach(val => {
        if(val.split("-")[0].toLowerCase() == rank.toLowerCase()) outcome = val.split("-")[1]
    })

    return outcome;

}

module.exports.help = {
    name: "roster",
    aliases: ["team", "r"],
    permission: Groups.DEFAULT,
    description: "Gets the roster for a team",
    usage: "roster <name>"
}
