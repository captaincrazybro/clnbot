var leagues = require("../../storage/leagues.json");
const fs = require("fs");
const Discord = require("discord.js")
const _MinecaftAPI = require("../../util/Constructors/_MinecraftAPI")
// const {get} = require('lodash');

module.exports = class _League {

    static getLeague(id) {
        if (!leagues[id]) return null;
        return leagues[id];
    }

    static setLeague(id, league) {
        leagues[id] = league;
        fs.writeFile('./storage/leagues.json', JSON.stringify(leagues), (err) => {
            if (err) console.log(err);
        })
    }

    static resetLeague(id) {
        this.setLeague(id, null);
    }

    static parseLeague(league) {
        var outcome;
        if (league.toLowerCase() == "twl" || league.toLowerCase() == "twlleague") outcome = "twl";
        else if (league.toLowerCase() == "ctfcl" || league.toLowerCase() == "ctfclleague") outcome = "ctfcl";
        else if (league.toLowerCase() == "ctcl" || league.toLowerCase() == "ctclleague") outcome = "ctcl";
        // else if (league.toLowerCase() == "dcl" || league.toLowerCase() == "dclleague") outcome = "dcl";
        // else if (league.toLowerCase() == "mbcl" || league.toLowerCase() == "mbclleague") outcome = "mbcl";
        else if (league.toLowerCase() == "cdcl" || league.toLowerCase() == "cdclleague") outcome = "cdcl";
        // else if (league.toLowerCase() == "decl" || league.toLowerCase() == "declleague") outcome = "decl";
        else if (league.toLowerCase() == "clt" || league.toLowerCase() == "cltleague") outcome = "clt";
        else if (league.toLowerCase() == "cwcl" || league.toLowerCase() == "cwclleague") outcome = "cwcl";
        else if (league.toLowerCase() == "cotc" || league.toLowerCase() == "cotcleague") outcome = "cotc";
        else if (league.toLowerCase() == "sgcl" || league.toLowerCaseI() == "sgclleague") outcome = "sgcl";
        else if (league.toLowerCase() == "cecl" || league.toLowerCase() == "ceclleague") outcome = "cecl";

        else outcome = null;
        return outcome;
    }

}
