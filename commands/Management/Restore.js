const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors');
const Groups = require('../../util/Enums/Groups');
const _Player = require('../../util/Constructors/_Player.js')
const _Team = require('../../util/Constructors/_Team.js');
const fs = require('fs')

module.exports.run = async (bot,message,args,cmd) => {

    let players = require('../../backup/players.json');
    let teams = require('../../backup/teams.json')
    let permissions = require('../../backup/permissions.json');

    fs.writeFile('./storage/players.json', JSON.stringify(players), (err) => {
        if(err) console.log(err);
    })

    fs.writeFile('./storage/teams.json', JSON.stringify(teams), (err) => {
        if(err) console.log(err);
    })

    fs.writeFile('./storage/permissions.json', JSON.stringify(permissions), (err) => {
        if(err) console.log(err);
    })

    new _NoticeEmbed(Colors.SUCCESS, "You have successfully restored from the backup").send(message.channel);

}

module.exports.help = {
    name: "restore",
    aliases: [],
    permission: Groups.MANAGER,
    description: "Restores to the backup",
    usage: "restore"
}