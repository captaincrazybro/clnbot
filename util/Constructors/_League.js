var leagues = require("../../storage/leagues.json");
const fs = require("fs");
const Discord = require("discord.js")
const _MinecaftAPI = require("../../util/Constructors/_MinecraftAPI")
const {get} = require('lodash');

module.exports = class _League {

    static getLeague(id){
        if(!leagues[id]) return null;
        return leages[id];
    }

    static setLeague(id, league){
        leagues[id] = league;
        fs.writeFile('./storage/leagues.json', JSON.stringify(leagues), (err) => {
            if(err) console.log(err);
        })
    }
    
    static resetLeague(id){
        this.setLeague(id, null);
    }

}