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
            throw err;
        }
        gpio.write(pin, true, function(err) {
            if (err) {
                throw err;
            }
        });
    });

    this.isOn = false;
    this.pin = pin;
}

Socket.prototype.turn = function(isOn) {
    const self = this;
    gpio.write(this.pin, !isOn, function (err) {
        if (err) {
            throw err;
        }
        self.isOn = isOn;
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
        this.isOn = isOn;
        console.log("Gpio " + this.pin + " is " + (this.On? "On":"Off"));
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
    
    this.update = function () {
        this.temp = 36.6;
        this.humi = 63.3;

        console.log("temp: " + this.temp);
        console.log("humi: " + this.humi);
    };
}

SensorMock.prototype.temperature = Sensor.prototype.temperature;
SensorMock.prototype.humidity = Sensor.prototype.humidity;


const sensor = new SensorFactory(4);
setInterval(sensor.update.bind(sensor), 10 * 1000);

module.exports.sensor = sensor;
module.exports.socket1 = new SocketFactory(12);
module.exports.socket2 = new SocketFactory(16);
module.exports.socket3 = new SocketFactory(18);
module.exports.socket4 = new SocketFactory(22);