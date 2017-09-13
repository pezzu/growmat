const schedule = require('node-schedule');
const audit = require('./../../commons/audit.js');

const jobs = {
    on: {},
    off: {}
};

let scheduled;

function setDayLight(dayLength, fnTurnOn, fnTurnOff) {

    const onTime = new schedule.RecurrenceRule();
    onTime.hour = (24 + 2 + (24-dayLength)/2) % 24;

    const offTime = new schedule.RecurrenceRule();
    offTime.hour = (24 + 2 - (24-dayLength)/2) % 24;

    if(("job" in jobs.on) && (jobs.on.job)) {
        jobs.on.action = fnTurnOn;
        jobs.on.job.reschedule(onTime, fnTurnOn);
        jobs.on.time = onTime.hour;
    }
    else {
        jobs.on = {
            action: fnTurnOn,
            job:    schedule.scheduleJob(onTime, fnTurnOn),
            time:   onTime.hour
        };
    }

    if(("job" in jobs.off) && (jobs.off.job)) {
        jobs.off.action = fnTurnOff;
        jobs.off.job.reschedule(offTime, fnTurnOff);
        jobs.off.time = offTime.hour;
    }
    else {
        jobs.off = {
            action: fnTurnOff,
            job:    schedule.scheduleJob(offTime, fnTurnOff),
            time:   offTime.hour
        };
    }

    audit.log('Daylight is scheduled for ' + onTime.hour + ':00 - ' + offTime.hour + ':00');
    if(scheduled) {
        clearTimeout(scheduled);
        scheduled = null;
    }
    scheduled = setTimeout(turnOnIfNeed, 10*1000);
}

function turnOnIfNeed() {
    const now = new Date().getHours();
    if((now >= jobs.on.time) && (now < jobs.off.time) || (jobs.on.time === jobs.off.time)) {
        jobs.on.action();
    }
    else {
        jobs.off.action();
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
