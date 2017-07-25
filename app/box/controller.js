const box = require('./peripheral.js');
const settings = require('../settings/model.js');
const scheduler = require('./scheduler.js');

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
        scheduler.setDayLight(settings.daylightHours, doDawn, doSunset);
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


function doDawn() {
    box.socket1.do();
    box.socket2.turnOn();
    box.socket3.turnOn();
}

function doSunset() {
    box.socket1.turnOff();
    box.socket2.turnOff();
    box.socket3.turnOff();
}

scheduler.setDayLight(settings.daylightHours, doDawn, doSunset);

module.exports.getParams = getParams;
module.exports.setParams = setParams;

