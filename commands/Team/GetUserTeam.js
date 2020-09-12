const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const _Team = require('../../util/Constructors/_Team');
const MySQL = require('../../MySQL');
const _League = require('../../util/Constructors/_League.js');

module.exports.run = async(bot,message,args,cmd) => {

    let settings = require('../../settings.json');
    if(_League.getLeague(message.guild.id) == null) return new _NoticeEmbed(Colors.ERROR, "This guild does not have a guild set! Use the " + settings.prefix + "setleague command to set the league's guild").send(message.channel);

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a role or user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(user != null) if(user.username == undefined) user = user.user;

    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid role or user - Specify a valid role or user (mention or id)").send(message.channel);
    
    let conn = MySQL.getConnection();

    conn.query("SELECT * FROM pbcl WHERE userId = ?", [user.id], (err, result) => {
        if(err) return console.log(err);
        if(require.length > 0){
            if(result[0].team == "None") return new _NoticeEmbed(Colors.INFO, "This player does not have a team");
            let embed = new Discord.RichEmbed()
                .setColor(Colors.INFO)
                .setDescription(`<@${user.id}>'s team is ${result[0].team}`)

            message.channel.send(embed);
        } else {
            conn.query("INSERT INTO pbcl (userId, team, role) VALUES (?, ?, ?)", [user.id, "None", "Member"], err => {
                if(err) console.log(err);
            });
            return new _NoticeEmbed(Colors.INFO, "This player does not have a team");
        }
    });

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`Successfully removed <@${user.id}>'s team`)

    message.channel.send(embed);

}

module.exports.help = {
    name: "getuserteam",
    aliases: ["userteam", "get-user-team"],
    permission: Groups.DEFAULT,
    description: "Gets a users team",
    usage: "getuserteam <user>"
}