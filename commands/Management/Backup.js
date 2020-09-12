const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors');
const Groups = require('../../util/Enums/Groups');
const _Player = require('../../util/Constructors/_Player.js')
const fs = require('fs')

module.exports.run = async (bot,message,args,cmd) => {

    const players = _Player.getPlayerObj();

    fs.writeFile('./js/bot/storage/players-backup.json', JSON.stringify(players), (err) => {
        if(err) console.log(err);
    })

    new _NoticeEmbed(Colors.SUCCESS, "Successfully backed up data (just players for now)").send(message.channel);

}

module.exports.help = {
    name: "backup",
    aliases: ["write"],
    permission: Groups.ADMIN,
    description: "Backups data",
    usage: "backup"
}