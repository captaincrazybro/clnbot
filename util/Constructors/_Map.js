var maps = require('../../storage/maps.json');
const fs = require('fs');

module.exports = class _Map{

    constructor(val, league){

        this.val = val;
        this.league = league;
        this.name = val.name;
        this.img = val.img;

        maps = require('../../storage/maps.json');

    }

    rename(newName){
        this.val.name = newName;
        let map = maps.find(map => map.name == this.name);
        map.name = newName;
        this.name = newName;
        fs.writeFile('./storage/maps.json', JSON.stringify(maps), (err) => {
            if(err) console.log(err);
        })
    }

    setImage(newImg){
        this.val.img = newImg;
        let map = maps.find(map => map.name == this.name);
        map.img = newImg;
        this.img = newImg;
        fs.writeFile('./storage/maps.json', JSON.stringify(maps), (err) => {
            if(err) console.log(err);
        })
    }

    delete(){
        maps[this.league] = maps[this.league].filter(map => map.name != this.name);
        fs.writeFile('./storage/maps.json', JSON.stringify(maps), (err) => {
            if(err) console.log(err);
        })
    }

    static mapExists(mapName, league){
        if(maps[league].length > 0) var filtered = maps[league].filter(val => val.name.toLowerCase() == mapName.toLowerCase());
        else return null;
        if(filtered.length == 0) return null;
        else return filtered.pop();
    }

    static getMap(name, league){
        let exists = this.mapExists(name, league)
        if(exists == null) return null;
        else return new _Map(exists, league);
    }

    static createMap(name, img, league){
        if(_Map.mapExists(name, league)) return null;
        let json = {
            name: name,
            img: img
        }
        maps[league].push(json);
        fs.writeFile('./storage/maps.json', JSON.stringify(maps), (err) => {
            if(err) console.log(err);
        })
        return new _Map(json, league);
    }

    static getMaps(league){
        let mapsArray = [];
        maps[league].forEach(map => {
            mapsArray.push(_Map.getMap(map.name, league));
        })
        return mapsArray;
    }

}