const fs = require('fs');
const path = require('path');

const homedir = require('os').homedir();
const storage = path.join(homedir, '.gromat.json');

function Settings() {
    this.DaylightHours = 14;
    this.load();
}

Settings.prototype.save = function() {
    fs.writeFileSync(storage, JSON.stringify(this));
}

Settings.prototype.load = function() {
    try {
        const settings = JSON.parse(fs.readFileSync(storage, 'utf8'));
        Object.keys(settings).forEach(key => this[key] = settings[key]);
    }
    catch (e) {
        console.error('Error reading config file. Will use defaults');
    }
}

module.exports = new Settings();