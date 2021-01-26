var modules = [];

// Register modules here
//modules.push(require('./RemoveBlacklists.js'))

module.exports.getModules = () => {
    return modules;
}

module.exports.runAll = () => {
    this.getModules().forEach(mod => {
        mod.run();
    })
}

