const schedule = require('node-schedule');

const jobs = {};

function setDayLight(dayLength, fnTurnOn, fnTurnOff) {

    const onTime = new schedule.RecurrenceRule();
    onTime.hour = (24 + 2 + dayLength/2) % 24;

    const offTime = new schedule.RecurrenceRule();
    offTime.hour = (24 + 2 - dayLength/2) % 24;

    jobs.on = {
        action: fnTurnOn,
        job:    schedule.scheduleJob(onTime, fnTurnOn),
        time:   onTime.hour
    };

    jobs.off = {
        action: fnTurnOff,
        job:    schedule.scheduleJob(offTime, fnTurnOff),
        time:   offTime.hour
    };

    turnOnIfNeed();
}

function turnOnIfNeed() {
    const now = new Date().getHours();
    if((now >= jobs.on.time) && (now < jobs.off.time) || (jobs.on.time === jobs.off.time)) {
        jobs.on.action();
    }
}

function onTime() {
    return jobs.on.time;
}

function offTime() {
    return jobs.off.time;
}

module.exports.setDayLight = setDayLight;
module.exports.onTime = onTime;
module.exports.offTime = offTime;
