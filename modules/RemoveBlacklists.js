const _Blacklist = require('../util/Constructors/_Blacklist.js');
const leagues = require('../bot.js').leagues;
const ms = require('ms');

module.exports.run = () => {

    let current = new Date();

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
    })
}