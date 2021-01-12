const { exists } = require("../util/Constructors/_Blacklist");
const _NoticeEmbed = require("../util/Constructors/_NoticeEmbed");
const Colors = require('../util/Enums/Colors.js');
const Discord = require('discord.js');

module.exports = class EmbedWizard {
    
    static run(message){
        if(this.embedWizardMap.has(message.author.id)){
            if(message.content.replace(" ", "").toLowerCase() == "exit" || message.content.replace(" ", "").toLowerCase() == "cancel"){
                this.embedWizardMap.delete(id);
                return;
            }

            let id = message.author.id;
            let el = this.embedWizardMap.get(id);
        
            switch(el.step){
                case(1):{
                    let color = message.content;
                    el.color = color;
                    el.step++;
                    this.embedWizardMap.set(id, el);
                    
                    return new _NoticeEmbed(Colors.SUCCESS, "You have successfully set the color to " + color + ". Please specify the description (can be multiple lines).")
                    break;
                }
                case(2):{
                    let description = message.content;
                    el.description = description;
                    el.step++;
                    this.embedWizardMap.set(id, el);

                    new _NoticeEmbed(Colors.SUCCESS, "You have successfully set the description. The Embed will now send.")

                    let embed = new Discord.MessageEmbed()
                        .setColor(e.color)
                        .setTitle(e.title)
                        .setDescription(e.description)

                    return message.guild.channels.cache.get(el.channel).send(embed);
                    break;
                }
                default:{
                    this.embedWizardMap.delete(id);
                    break;
                }
            }
        }
    }

    static embedWizardMap = new Map();

}