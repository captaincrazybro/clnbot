const MojangAPI = require('mojang-api')
const request = require('request');
const { Mojang } = require("node-mojang-api");
const getJSON = require("get-json");
const MinecraftAPI = require('minecraft-api');

module.exports = class _MinecaftAPI {

    /**
     * 
     * @param {String} name 
     * @returns {Promise<String>}
     */

    static getUuid(name){
        var promise = new Promise(function(resolve, reject){
            if(name == "None") return resolve(null);
            request({
                url: `https://api.mojang.com/users/profiles/minecraft/${name}`,
                json: true
            }, function (error, response, body) {

                if(error){
                    resolve(null);
                    console.log(error);
                } else {
                    resolve(body);
                }
            }) 
        })
        return promise;
    }

    /**
     * @param {String} uuid
     * @returns {Promise<String>}
     */

    static getName(uuid){
        var promise = new Promise(function(resolve, reject){
            if(uuid == "None") return resolve(null);
            request({
                url: `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`,
                json: true
            }, function (error, response, body) {

                if(error){
                    resolve(null);
                    console.log(error);
                }
            
                if (!error && response.statusCode === 200) {
                    resolve(body.name);
                } else {
                    resolve(null);
                }
            }) 
        })
        return promise;
    }

    /*                  if(uuid == "None") return resolve(null);
            request({
                url: `https://api.mojang.com/user/profiles/${uuid}/names`,
                json: true
            }, function (error, response, body) {

                if(error){
                    resolve(null);
                    console.log(error);
                }
            
                if (!error && response.statusCode === 200) {
                    resolve(body[0].name);
                }
            })        */

}
