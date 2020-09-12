var matches = require('../../storage/matches.json');
const fs = require('fs');

module.exports = class _Match {

    /**
     * 
     * @param {Number} index
     * @param {Object} obj
     */

    constructor(index, obj){

        this.team1 = obj.team1;
        this.team2 = obj.team2;
        this.score1 = obj.score1;
        this.score2 = obj.score2;
        this.date = obj.date;
        this.index = index;
        this.obj = obj;
        this.minutes = obj.minutes;
        this.team1Players = obj.team1Players;
        this.team2Players = obj.team2Players;
        this.ref = obj.ref;
        this.host = obj.host;
        if(obj.hostMc == undefined) obj.hostMc = null;
        this.hostMc = obj.hostMc;
        this.media = obj.media;
        this.season = obj.season;

    }

    /**
     * 
     * @param {String} id 
     */
    
    setRef(id){
        this.ref = id;
        this.obj.ref = id;
        matches[this.index] = this.obj;
        fs.writeFile('./storage/matches.json', JSON.stringify(matches), err => {
            if(err) console.log(err);
        })
    }

    /**
     * 
     * @param {String} mcName 
     */

    setHostMc(mcName){
        this.hostMc = mcName;
        this.obj.hostMc = mcName;
        matches[this.index] = this.obj;
        fs.writeFile('./storage/matches.json', JSON.stringify(matches), err => {
            if(err) console.log(err);
        })
    }

    /**
     * 
     * @param {String} id 
     */
    
    setHost(id){
        this.host = id;
        this.obj.host = id;
        matches[this.index] = this.obj;
        fs.writeFile('./storage/matches.json', JSON.stringify(matches), err => {
            if(err) console.log(err);
        })
    }

        /**
     * 
     * @param {String} id 
     */
    
    setMedia(id){
        this.media = id;
        this.obj.media = id;
        matches[this.index] = this.obj;
        fs.writeFile('./storage/matches.json', JSON.stringify(matches), err => {
            if(err) console.log(err);
        })
    }

    /**
     * 
     * @param {Number} score1 
     * @param {Number} score2 
     */

    setScore(score1, score2){
        this.score1 = score1;
        this.score2 = score2;
        this.obj.score1 = score1;
        this.obj.score2 = score2;
        matches[this.index] = this.obj;
        fs.writeFile('./storage/matches.json', JSON.stringify(matches), err => {
            if(err) console.log(err);
        })
    }

    /**
     * 
     * @param {Date} date 
     */

    setTime(date){
        this.date = date;
        this.minutes = (date.getMinutes() + 1) + 60 * date.getHours() * date.getDate() * date.getMonth() * (date.getFullYear() - 2000);
        this.obj.date = date.toString();
        this.obj.minutes = (date.getMinutes() + 1) + 60 * date.getHours() * date.getDate() * date.getMonth() * (date.getFullYear() - 2000);
        matches[this.index] = this.obj;
        fs.writeFile('./storage/matches.json', JSON.stringify(matches), err => {
            if(err) console.log(err);
        })
    }
    
    /**
     * 
     * @param {Array} team1Players 
     * @param {Array} team2Players 
     */

    setPlayers(team1Players, team2Players){
        this.obj.team1Players = team1Players;
        this.team1Players = team1Players;
        this.obj.team2Players = team2Players;
        this.team2Players = team2Players;
        matches[this.index] = this.obj;
        fs.writeFile('./storage/matches.json', JSON.stringify(matches), err => {
            if(err) console.log(err);
        })
    }

    delete(){
        matches = matches.filter((_val, i) => i != this.index);
        fs.writeFile('./storage/matches.json', JSON.stringify(matches), err => {
            if(err) console.log(err);
        })
    }

    /**
     * @param {Number} id
     * @returns {_Match}
     */

    static getMatchById(id){
        if(matches.length - 1 < id) return null;
        else {
            let obj = matches[id];
            return new _Match(id, obj);
        }
    }

    /**
     * 
     * @param {Date} date 
     * @param {Number} team1 
     * @param {Number} team2 
     * @returns {_Match}
     */

    static getMatch(date, team1, team2){
        let filtered = matches.filter(val => val.date == date.toDateString() && ((val.team1 == team1 && val.team2 == team2 ) || (val.team1 == team2 && val.team2 == team1)));
        if(filtered.length == 0) return null;
        else {
            let obj = filtered.pop();
            return new _Match(matches.indexOf(obj), obj);
        }
    }

    /**
     * 
     * @param {String} team1 
     * @param {String} team2 
     * @param {Number} score1 
     * @param {Number} score2 
     * @param {Date} date 
     * @returns {_Match}
     */

    static createMatch(team1, team2, score1, score2, date){
        let dateString = null;
        if(date != null) dateString = date.toString();
        let minutes = 0;
        if(date != null) date.getMinutes() * date.getHours() * date.getDate() * date.getMonth() * (date.getFullYear() - 2000)
        let obj = {
            team1: team1,
            team2: team2,
            score1: score1,
            score2: score2,
            date: dateString,
            minutes: minutes,
            team1Players: [],
            team2Players: [],
            ref: null,
            refMc: null,
            host: null,
            media: null,
            season: 4
        }
        matches.push(obj);
        fs.writeFile("./storage/matches.json", JSON.stringify(matches), err => {
            if(err) console.log(err);
        });
        return new _Match(matches.length - 1, obj);
    }

    /**
     * 
     * @param {String} team1 
     * @param {String} team2 
     * @returns {Array}
     */

    static findMatches(team1, team2){
        let filtered = matches.filter(val => (val.team1 == team1 && val.team2 == team2) || (val.team1 == team2 && val.team2 == team1));
        if(filtered.length == 0) return null;
        else return filtered;
    }

    /**
     * 
     * @param {String} team
     * @returns {Array}
     */

    static findMatches(team){
        let filtered = matches.filter(val => val.team1 == team || val.team2 == team);
        if(filtered.length == 0) return null;
        else return filtered;
    }

    /**
     * 
     * @param {Date} dayDate 
     * @returns {Array}
     */

    static findMatches(dayDate){
        let filtered = matches.filter(val => {
            let date = new Date(val.date);
            return date.getFullYear() == dayDate.getFullYear() && date.getMonth() == dayDate.getMonth() && date.getDate() == dayDate.getDate();
        });
        if(filtered.length == 0) return null;
        else return filtered;
    }

    /**
     * @returns {Array}
     */

    static getMatchesObj(){
        return matches;
    }

}