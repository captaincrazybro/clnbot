const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')

module.exports.run = async (bot, message, args, cmd) => {
    // console.log(message.guild);**Offline**: ${message.guild.members.cache.filter(m => m.presence.status !== "offline").size}
    // console.log(await message.guild.members.fetch()) dont
    let embed = new Discord.MessageEmbed()
        .setColor(Colors.INFO)
        .setAuthor("Server Info")
        .setDescription(`\n\n
        **Name**: ${message.guild.name}
        **Owner**: ${await message.guild.members.fetch(message.guild.ownerID) /*message.guild.owner.user.username*/}
        **Members**: ${message.guild.memberCount}
        **Online**: ${ message.guild.members.cache.filter(m => m.presence.status == "offline").size}
        `)
        .setThumbnail(message.guild.iconURL);

    message.channel.send(embed);

}

module.exports.help = {
    name: "serverinfo",
    aliases: ["server-info", "server"],
    permission: Groups.DEFAULT,
    description: "Gets info about the discord server",
    usage: "serverinfo"
}