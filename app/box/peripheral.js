const gpio = require('rpi-gpio');


function Socket(channel) {    
    gpio.setup(channel, gpio.DIR_HIGH, function(err) {
        if (err) {
            throw err;
        }
        gpio.write(channel, true, function(err) {
            if (err) { 
                throw err;
            }
        });
    });

    this.channel = channel;
}

Socket.prototype.turn = function(isOn) {
    gpio.write(this.channel, isOn, function(err) {
        if (err) { 
            throw err;
        }
    });
}

Socket.prototype.turnOn = function() {
    this.turn(false);
}

Socket.prototype.turnOff = function() {
    this.turn(true);
}


module.exports.socket1 = new Socket(12);
module.exports.socket2 = new Socket(16);
module.exports.socket3 = new Socket(18);
module.exports.socket4 = new Socket(22);
