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

	var ranksThing = "";
	
	ranks.forEach(val => ranksThing +=`${val.split("-")[1]} - ${val.split("-")[0]}\n`);

	let embed = new Discord.RichEmbed()
		.setColor(Colors.INFO)
		.setTitle("Ranks")
		.setDescription(ranksThing);	

	message.channel.send(embed);


    return;

}

function getTeam(team){
    
    var teamNames = [];
    
    teams.forEach(val => {
        teamNames.push(val.name);
    });
    
    let teamName = stringUtil.findBestMatch(team, teamNames).bestMatch.target;
    
    let returnTeam = _Team.getTeam(teamName);
    
    return returnTeam;
    
}

function getRankOrder(emoji){
    
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
    name: "listranks",
    aliases: ["list-ranks", "ranks"],
    permission: Groups.DEFAULT,
    description: "Gets the ranks",
    usage: "ranks"
}
