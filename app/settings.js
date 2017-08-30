const fs = require('fs');
const path = require('path');

const homedir = require('os').homedir();
const storage = path.join(homedir, '.gromat.json');

const parameters = {};

function Settings() {
    load();
}

save = function() {
    fs.writeFileSync(storage, JSON.stringify(parameters));
}

load = function() {
    try {
        const settings = JSON.parse(fs.readFileSync(storage, 'utf8'));
        Object.keys(settings).forEach(key => parameters[key] = settings[key]);
    }
    catch (e) {
        console.error('Error reading config file. Will use defaults');
    }
}

Settings.prototype.add = function (name, defValue) {
    if (!(name in parameters)) {
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