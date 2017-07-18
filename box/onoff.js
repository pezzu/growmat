var gpio = require('rpi-gpio');

// gpio.setup(7, gpio.DIR_IN, readInput);

// function readInput() {
//     gpio.read(7, function(err, value) {
//         console.log('The value is ' + value);
//     });
// }

gpio.setup(12, gpio.DIR_LOW, function(err) {
    if (err) throw err;
});


function writePy(value) {
    gpio.write(12, value, function(err) {
        if (err) throw err;
    });
}

module.exports.turnOn = function() {
    writePy(true);
};

module.exports.turnOff = function() {
    writePy(false);
}

// https://www.npmjs.com/package/rpi-gpio

