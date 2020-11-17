const fs = require('fs');
//const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const _League = require('../../util/Constructors/_League');

module.exports.run = async (bot, message, args, cmd) => {

	let settings = require('../../settings.json');
	if (_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a guild set! Use the " + settings.prefix + "setleague command to set the league's guild").send(message.channel);

	let league = _League.getLeague(message.guild.id);

	let users = require("../../storage/permissions.json")

	let usersObj = users[league].users;
	let rolesObj = users[league].roles;

	let userMap = new Map(Object.entries(usersObj))

	var members = "";

	// console.log(userMap);
	let groupKeys = await Groups.parse
	console.log(groupKeys)
	let i = groupKeys.key;
	console.log(i)
	// let users = [];
	while (i--) {
		console.log("I", i)
		if (i == 0)
			break;
		let groupUsers = userMap.keys().filter((v) => v == Groups.parse[i] && v != 0);
		for (let k = 0; k < groupUsers.length; k++) {
			members += `User - <@${userMap.get().toString()}> - ${Groups.parse[i]}\n`
			console.log(members);

		}
	}
	// userMap.forEach((k, v) => {
	// 	if (k.group != 0) {
	// 		var group = Groups.parse[k.group];
	// 		members += `User - <@${v.toString()}> - ${group}\n`
	// 	}
	// });

	if (rolesObj) {
		let roleMap = new Map(Object.entries(rolesObj))
		roleMap.forEach((k, v) => {
			if (k.group != 0) {
				var group = Groups.parse[k.group];
				members += `Role - <@${v}> - ${group}\n`
			}
		})
	}

	let embed = new Discord.MessageEmbed()
		.setColor(Colors.INFO)
		.setAuthor("Staff")
		.setDescription(members);

	message.channel.send(embed);

}

module.exports.help = {
	name: "liststaff",
	aliases: ["list-staff"],
	permission: Groups.MOD,
	description: "Lists the staff",
	usage: "liststaff"
}
