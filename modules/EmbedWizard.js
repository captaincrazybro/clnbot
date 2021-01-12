const { exists } = require("../util/Constructors/_Blacklist");
const _NoticeEmbed = require("../util/Constructors/_NoticeEmbed");
const Colors = require('../util/Enums/Colors.js');
const Discord = require('discord.js');

module.exports = class EmbedWizard {
    
    static run(message){
        if(this.embedWizardMap.has(message.author.id)){
            console.log("hi");
            if(message.content.replace(" ", "").toLowerCase() == "exit" || message.content.replace(" ", "").toLowerCase() == "cancel"){
                this.embedWizardMap.delete(id);
                return;
            }

            let id = message.author.id;
            let el = this.embedWizardMap.get(id);
        
            switch(el.step){
                case(1):{
                    let color = message.content.toUppderCase();
                    el.color = color;
                    el.step++;
                    this.embedWizardMap.set(id, el);
                    
                    return new _NoticeEmbed(Colors.SUCCESS, "You have successfully set the color to " + color + ". Please specify the description (can be multiple lines).").send(message.channel);
                    break;
                }
                case(2):{
                    let description = message.content;
                    el.description = description;
                    el.step++;
                    this.embedWizardMap.set(id, el);

                    new _NoticeEmbed(Colors.SUCCESS, "You have successfully set the description. The Embed will now send.").send(message.channel);

                    let embed = new Discord.MessageEmbed()
                        .setColor(el.color)
                        .setTitle(el.title)
                        .setDescription(el.description)

                    message.guild.channels.cache.find(val => val.id == el.channel).send(embed);
                    return this.embedWizardMap.delete(message.author.id);
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