const users = require('../../storage/permissions.json');
const Groups = require('../Enums/Groups.js');
const fs = require('fs');
const settings = require("../../settings.json");
let economy = require('../../storage/economy.json');
const punishments = require('../../storage/punishments.json');

module.exports = class _User {

    constructor(id){
        if(!users.users){
            users.users = {};
        }
        if(!users.users[id]){
            users.users[id] = {
                group: Groups.DEFAULT
            }
        }
        if(!users.users[id].commands){
            users.users[id].commands = {
            }
        }
        if(settings.owners.includes(id)){
            users.users[id] = {
                group: Groups.OWNER
            }
        } 
        if(!punishments[id]){
            punishments[id] = [];
            fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
                if(err) console.log(err);
            })
        }
        if(!punishments.number){
            punishments.number = 0;
            fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
                if(err) console.log(err);
            })
        }
        if(!economy[id]){
            economy[id] = {
                xp: 0
            }
            fs.writeFile('./storage/economy.json', JSON.stringify(economy), err => {
                if(err) console.log(err);
            })
        }
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
          if(err) console.log(err);
        })
        this.xp = economy[id].xp;
        this.id = id;
        this.bot = require("../../bot.js").bot;
    }

    get getGroup(){
        return parseInt(users.users[this.id].group);
    }

    hasCommadPerm(commandName){
        if(!users.users[this.id].commands[commandName] || users.users[this.id].commands[commandName] == false){
            return false;
        } else {
            return true;
        }
    }
    
    getLevel(){
        let outcome = this.xp / 15000;
        outcome++;
        return `${outcome}`.charAt(0);
    }
    
    updateEconomy(){
        let newObj = economy[this.id];
        newObj.xp = this.xp;
        economy[this.id] = newObj;
        fs.writeFile('./storage/economy.json', JSON.stringify(economy), err => {
            if(err) console.log(err);
        });
        return this;
    }

    setGroup(group){
        users.users[this.id].group = group;
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
        })
    }

    addPunishment(type, moderatorId, reason, duration){
        if(!punishments[this.id].number){
            punishments[this.id].number = 0;
        }
        if(!duration){
            let date = new Date();
            let json = {
                type: type,
                date: date.toString(),
                moderator: moderatorId,
                reason: reason,
                duration: '',
                id: punishments.number
            };
            punishments[this.id].push(json)
            punishments.number++;
            fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
                if(err) console.log(err);
            })
            return json;
        }
        let date = new Date();
        let json = {
            type: type,
            date: date.toString(),
            moderator: moderatorId,
            reason: reason,
            duration: duration,
            id: punishments.number
        };
        punishments[this.id].push(json)
        punishments.number++;
        fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
            if(err) console.log(err);
        })
        return json;
    }

    removePunishment(type, moderatorId){
        if(!moderatorId){
            let filtered = punishments[this.id].filter((val) => val.type == type);
            if(filtered.length < 1) return false;
            let val = filtered.shift();
            punishments[this.id] = punishments[this.id].filter((v) => v != val)
            fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
                if(err) console.log(err);
            })
            return val;
        }
        let filtered = punishments[this.id].filter((val) => val.moderator == moderatorId && val.type == type);
        if(filtered.length > 1) return false;
        let val = filtered.shift();
        punishments[this.id] = punishments[this.id].filter((v) => v != val)
        fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), (err) => {
            if(err) console.log(err);
        })
        return val;
    }

    getPunishments(){
        return punishments[this.id];
    }

    getPunishment(id){
        let punishment = punishments[this.id].filter((v) => v.id == id);
        return punishment.shift();
    }

    setCommandPerm(commandName, boolean){
        users.users[this.id].commands[commandName] = boolean;
        fs.writeFile('./storage/permissions.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
        })
    }

    hasPermission(prop){
        return prop.help.permission <= this.getGroup || this.hasCommadPerm(prop.help.name);
    }
    
    static getEconomyMap(){
        return new Map(Object.entries(economy));
    }

}
