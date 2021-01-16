const _Blacklist = require('../util/Constructors/_Blacklist.js');
const ms = require('ms');
const bot = require('../bot.js')
const leagues = bot.commands;
const Module = require('./Module.js');
console.log(leagues);

module.exports = class RemoveBlacklists extends Module {

    static run() {

        let current = new Date();

        console.log(leagues);

        /*leagues.forEach(l => {
            _Blacklist.blacklists(l).forEach(bl => {
                if(bl.type.toLowerCase() != "permanent"){
                    let dateArr = bl.end_date.split("-");
                    let date = new Date()
                    date.setMonth(dateArr[0])
                    date.setDate(dateArr[1]);
                    date.setFullYear(dateArr[2]);
                    if(current >= date) bl.delete();
                }
            })
        })*/

        setInterval(() => {
            leagues.forEach(l => {
                _Blacklist.blacklists(l).forEach(bl => {
                    if(bl.type.toLowerCase() != "permanent"){
                        let dateArr = bl.end_date.split("-");
                        let date = new Date()
                        date.setMonth(dateArr[0])
                        date.setDate(dateArr[1]);
                        date.setFullYear(dateArr[2]);
                        if(current >= date) bl.delete();
                    }
                })
            })
        }, ms("1d"))
    }
    
}