const box = require('./peripheral.js');
const settings = require('../settings/model.js');

function getParams() {
    return {
        temperature:    12,
        humidity:       34,
        light:          box.socket1.isPowered(), 
        ventilation:    box.socket2.isPowered(),
        circulation:    box.socket3.isPowered(),
        daylightHours:  settings.daylightHours
    };

};

function setParams(data) {
    if ('daylightHours' in data) {
        settings.daylightHours = data.daylightHours;
        settings.save();
    }

    if ('light' in data) {
        box.socket1.turn(data.light == true); 
    }

    if ('ventilation' in data) {
        box.socket2.turn(data.ventilation == true);
    }

    if ('circulation' in data) {
        box.socket3.turn(data.circulation == true);
    }

    return getParams();
};

module.exports.getParams = getParams;
module.exports.setParams = setParams;