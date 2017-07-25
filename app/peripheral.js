const os = require('os');

if (os.platform() !== 'win32') {
    var gpio = require('rpi-gpio');
    var SocketFactory = Socket;
}
else {
    var SocketFactory = SocketMock;
}

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

    this.isOn = false;
    this.channel = channel;
}

Socket.prototype.turn = function(isOn) {
    gpio.write(this.channel, isOn, function(err) {
        if (err) {
            throw err;
        }
    });
}

Socket.prototype.isPowered = function() {
    return this.isOn;
}

Socket.prototype.turnOn = function() {
    this.isOn = true;
    this.turn(false);
}

Socket.prototype.turnOff = function() {
    this.isOn = false;
    this.turn(true);
}

function SocketMock(channel) {
    this.channel = channel;
    this.isOn = false;
    this.turn = function (isOn) {
        console.log("Gpio " + this.channel + " is " + (this.isOn? "On":"Off"));
    };
}

SocketMock.prototype.turnOn = Socket.prototype.turnOn;
SocketMock.prototype.turnOff = Socket.prototype.turnOff;
SocketMock.prototype.isPowered = Socket.prototype.isPowered;


module.exports.socket1 = new SocketFactory(12);
module.exports.socket2 = new SocketFactory(16);
module.exports.socket3 = new SocketFactory(18);
module.exports.socket4 = new SocketFactory(22);