const fs = require('fs');
const path = require('path');
const audit = require('./audit.js');

const homedir = require('os').homedir();
const storage = path.join(homedir, '.gromat.json');

const parameters = {};

function Settings() {
    load();
}

save = function() {
    fs.writeFileSync(storage, JSON.stringify(parameters));
    audit.log('Saved settings: ' + JSON.stringify(parameters));
}

load = function() {
    try {
        const settings = JSON.parse(fs.readFileSync(storage, 'utf8'));
        Object.keys(settings).forEach(key => parameters[key] = settings[key]);
        audit.log('Loaded settings: ' + JSON.stringify(parameters));
    }
    catch (e) {
        audit.log('Error reading config file. Will use defaults');
    }
}

Settings.prototype.add = function (name, defValue) {
    if (!Object.hasOwnProperty(parameters, name)) {
        parameters[name] = defValue;
    }    
    
    Object.defineProperty(this, name, {
        enumerable: true,
        get: function () {
            return parameters[name];
        },
        set: function (value) {
            parameters[name] = value;
            save();
        }
    });
}

module.exports = new Settings();