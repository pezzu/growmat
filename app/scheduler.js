const scheduler = require('node-schedule');

const jobs = {};

function setDayLight(dayLength, fnTurnOn, fnTurnOff) {

    const onTime = new schedule.RecurrenceRule();
    onTime.hour = (24 + 2 + dayLength/2) % 24;

    const offTime = new schedule.RecurrenceRule();
    offTime.hour = (24 + 2 - dayLength/2) % 24;

    jobs.on = {
        action: fnTurnOn,
        job:    schedule.scheduleJob(onTime, fnTurnOn),
        hour:   onTime.hour
    };

    jobs.off = {
        action: fnTurnOff,
        job:    schedule.scheduleJob(offTime, fnTurnOff),
        hour:   offTime.hour
    };

    turnOnIfNeed();
}

function turnOnIfNeed() {
    const now = new Date().getHours();
    if((now >= jobs.on.hour) && (now < jobs.off.hour) || (jobs.on.hour === jobs.off.hour)) {
        jobs.on.action();
    }
}

module.exports.setDayLight = setDayLight;
