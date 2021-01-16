const _Blacklist = require('../util/Constructors/_Blacklist.js');
const ms = require('ms');
const bot = require('../bot.js')
const leagues = bot.leagues;
const Module = require('./Module.js');

module.exports = class RemoveBlacklists extends Module {

    static run() {

        let current = new Date();

        leagues.forEach(l => {
            _Blacklist.blacklists(l).forEach(bl => {
                if(bl.type.toLowerCase() != "permanent"){
                    let dateArr = bl.end_date.split("-");
                    let date = new Date()
                    date.setMonth(dateArr[0])
                    date.setDate(dateArr[1]);
                    date.setFullYear(dateArr[2]);
                    let realBl = _Blacklist.getBlacklist(bl.uuid, l);
                    if(current >= date) realBl.delete();
                }
            })
        })

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