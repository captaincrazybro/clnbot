const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors');
const Groups = require('../../util/Enums/Groups');
const _Player = require('../../util/Constructors/_Player.js')
const _Team = require('../../util/Constructors/_Team.js');
const fs = require('fs')

module.exports.run = async (bot,message,args,cmd) => {

    let players = require("../../storage/players.json");
    let teams = require("../../storage/teams.json");

    fs.writeFile('./backup/players.json', JSON.stringify(players), (err) => {
        if(err) console.log(err);
    })

    fs.writeFile('./backup/teams.json', JSON.stringify(teams), (err) => {
        if(err) console.log(err);
    })

    new _NoticeEmbed(Colors.SUCCESS, "You have successfully backed up the players and teams").send(message.channel);

}

module.exports.help = {
    name: "backup",
    aliases: ["write"],
    permission: Groups.ADMIN,
    description: "Backups data",
    usage: "backup"
}