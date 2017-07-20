const gpio = require('rpi-gpio');


function Socket(channel) {    
    gpio.setup(channel, gpio.DIR_LOW, function(err) {
        if (err) {
            throw err;
        }
    });

    this.channel = channel;
}

Socket.turn = function(isOn) {
    gpio.write(this.channel, isOn, function(err) {
        if (err) { 
            throw err;
        }
    });
}

Socket.turnOn = function() {
    this.turn(true);
}

Socket.turnOff = function() {
    this.turn(false);
}


module.exports.socket1 = new Socket(12);
module.exports.socket2 = new Socket(13);
module.exports.socket3 = new Socket(14);
module.exports.socket4 = new Socket(15);