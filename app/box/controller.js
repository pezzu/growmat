// const box = require('./peripheral.js');
const settings = require('../settings/model.js');

module.exports.getParams = function() {

    return {
        temperature: 12,
        humidity: 34,
        light: false, 
        ventilation: true,
        circulation: false
    };

};

module.exports.setParams = function(data) {

    Object.keys(data).forEach(function (key) { 
        if (typeof settings[key] != 'undefined') {
            settings[key] = data[key];
        }
    });

    // var result;

    if ('light' in data) {
        // box.socket1.turn(data.light === true);
        
        const isOn = (data.light == true);

        var result = {
            light: isOn, 
            ventilation: isOn,
            circulation: isOn
        }; 
    }

    if ('ventilation' in data) {
        // box.socket2.turn(data.ventilation === true);

        const isOn = (data.ventilation == true);
        var result = {
            light: isOn, 
            ventilation: isOn,
            circulation: isOn
        }; 
    }

    if ('circulation' in data) {
        // box.socket3.turn(data.circulation === true);
        const isOn = (data.circulation == true);
        var result = {
            light: isOn, 
            ventilation: isOn,
            circulation: isOn
        }; 
    }

    return result;
};

