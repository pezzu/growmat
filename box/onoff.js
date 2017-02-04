var gpio = require('rpi-gpio');

// gpio.setup(7, gpio.DIR_IN, readInput);

// function readInput() {
//     gpio.read(7, function(err, value) {
//         console.log('The value is ' + value);
//     });
// }

gpio.setup(12, gpio.DIR_OUT, function(err) {
    if (err) throw err;
});


function writePy(value) {
    console.log(value);
    gpio.write(12, value, function(err) {
        if (err) throw err;
    });
}


writePy(true);

module.exports.turnOn = function() {
    writePy(true);
    console.log("Turned on");
};

module.exports.turnOff = function() {
    writePy(false);
    console.log("Turned off");
}

// https://www.npmjs.com/package/rpi-gpio

