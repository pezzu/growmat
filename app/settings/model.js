const fs = require('fs');
const path = require('path');

const homedir = require('os').homedir();
const storage = path.join(homedir, '.gromat.json');

function Settings() {
    this.DaylightHours = 14;
}

Settings.prototype.save = function() {
    fs.writeFileSync(storage, JSON.stringify(this));
}

Settings.prototype.load = function() {
    fs.readFile(storage, 'utf8', function(err, data) {
        if(!err) {
            const settings = JSON.parse(data);
            Object.keys(settings).forEach(key => this['key'] = settings['key']);
        }
    });
}

module.exports = new Settings();