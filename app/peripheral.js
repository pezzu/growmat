const isPi = require('detect-rpi');

if (isPi()) {
    var gpio = require('rpi-gpio');
    var rpisensor = require('node-dht-sensor');
    var SocketFactory = Socket;
    var SensorFactory = Sensor;
}
else {
    var SocketFactory = SocketMock;
    var SensorFactory = SensorMock;
}

function Socket(pin) {
    gpio.setup(pin, gpio.DIR_HIGH, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        gpio.write(pin, true, function(err) {
            if (err) {
                console.error(err);
            }
        });
    });

    this.isOn = false;
    this.pin = pin;
}

Socket.prototype.turn = function(isOn) {
    const self = this;

    return new Promise(function (resolve, reject) {
        gpio.write(self.pin, !isOn, function (err) {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                self.isOn = isOn;
                resolve();
            }
        });
    });
}

Socket.prototype.isPowered = function() {
    return this.isOn;
}

Socket.prototype.turnOn = function() {
    this.turn(true);
}

Socket.prototype.turnOff = function() {
    this.turn(false);
}

function SocketMock(pin) {
    this.pin = pin;
    this.isOn = false;

    this.turn = function (isOn) {
        const self = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                self.isOn = isOn;
                console.log("Gpio " + self.pin + " is " + (self.isOn ? "On" : "Off"));
                resolve();
            }, 10);
        });
    };
}

SocketMock.prototype.turnOn = Socket.prototype.turnOn;
SocketMock.prototype.turnOff = Socket.prototype.turnOff;
SocketMock.prototype.isPowered = Socket.prototype.isPowered;

function Sensor(pin) {
    this.pin = pin;
    this.temp = 0;
    this.humi = 0;

    this.update = function () {
        const self = this;
        rpisensor.read(22, this.pin, function (err, temperature, humidity) {
            if (!err) {
                self.temp = temperature.toFixed(1);
                self.humi = humidity.toFixed(1);
            }
            else {
                console.error(err);
            }
        });
    }
}

Sensor.prototype.temperature = function () {
    return this.temp;
}

Sensor.prototype.humidity = function () {
    return this.humi;
}

function SensorMock(pin) {
    this.pin = pin;
    this.temp = 0;
    this.humi = 0;

    this.diff = 0;
    this.inc = 1;

    this.update = function () {
        this.temp = (36.6 + this.diff).toFixed(1);
        this.humi = (63.3 + this.diff).toFixed(1);

        this.diff += 0.1 * this.inc;
        if (this.diff >= 1 || this.diff <= -1) {
            this.inc = -this.inc;
        }

        console.log("temp: " + this.temp + ", humi: " + this.humi);
    };
}

SensorMock.prototype.temperature = Sensor.prototype.temperature;
SensorMock.prototype.humidity = Sensor.prototype.humidity;


const sensor = new SensorFactory(4);
setTimeout(sensor.update.bind(sensor), 5 * 1000);
setInterval(sensor.update.bind(sensor), 60 * 1000);

module.exports.sensor = sensor;
module.exports.socket1 = new SocketFactory(12);
module.exports.socket2 = new SocketFactory(16);
module.exports.socket3 = new SocketFactory(18);
module.exports.socket4 = new SocketFactory(22);