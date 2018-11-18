const box = require('./peripheral.js');
const settings = require('./settings.js');
const scheduler = require('./scheduler.js');
const audit = require('audit');

async function getParams() {
    return {
        temperature:    box.sensor.temperature(),
        humidity:       box.sensor.humidity(),
        light:          box.socket1.isPowered(),
        ventilation:    box.socket2.isPowered(),
        circulation:    box.socket3.isPowered(),
        daylightHours:  settings.daylightHours,
        dawn:           scheduler.onTime(),
        sunset:         scheduler.offTime()
    };

};

async function setParams(data) {
    if ('daylightHours' in data) {
        settings.daylightHours = data.daylightHours;
        scheduler.setDayLight(settings.daylightHours, doDawn, doSunset);
    }

    if ('light' in data) {
        await box.socket1.turn(data.light == true);
    }

    if ('ventilation' in data) {
        await box.socket2.turn(data.ventilation == true);
    }

    if ('circulation' in data) {
        await box.socket3.turn(data.circulation == true);
    }

    return getParams();
};


function doDawn() {
    audit.log('Scheduled dawn');
    box.socket1.turnOn();
    box.socket2.turnOn();
    box.socket3.turnOn();
}

function doSunset() {
    audit.log('Scheduled sunset');
    box.socket1.turnOff();
    box.socket2.turnOff();
    box.socket3.turnOff();
}

settings.add('daylightHours', 18);
scheduler.setDayLight(settings.daylightHours, doDawn, doSunset);

module.exports.getParams = getParams;
module.exports.setParams = setParams;

