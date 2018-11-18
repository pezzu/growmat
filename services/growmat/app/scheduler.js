const schedule = require('node-schedule');
const audit = require('audit');

const jobs = {
    on: {},
    off: {}
};


function setDayLight(dayLength, fnTurnOn, fnTurnOff) {

    jobs.on.action = fnTurnOn;
    jobs.off.action = fnTurnOff;

    if(dayLength == 0) {
        var onHour = 0, offHour = 0;        // always off
        cancelAllJobs();
    }
    else if (dayLength == 24) {
        var onHour = 0, offHour = 24;       // always on
        cancelAllJobs();
    }
    else {
        var onHour = (24 + 2 + (24-dayLength)/2) % 24,
           offHour = (24 + 2 - (24-dayLength)/2) % 24;

        scheduleJob(jobs.on, fnTurnOn, onHour);
        scheduleJob(jobs.off, fnTurnOff, offHour);
    }

    jobs.on.time = onHour;
    jobs.off.time = offHour;

    audit.log('Daylight is scheduled for ' + onHour + ':00 - ' + offHour + ':00');
    turnOnIfNeeded();
}


function cancelAllJobs() {
    if(jobs.on.job) {
        jobs.on.job.cancel();
        jobs.on.job = null;
    }

    if(jobs.off.job) {
        jobs.off.job.cancel();
        jobs.off.job = null;
    }
}


function scheduleJob(job, action, hour) {
    const trigger = new schedule.RecurrenceRule();
    trigger.hour = hour;
    trigger.minute = 0;

    if(job.job) {
        job.job.reschedule(trigger, action);
    }
    else {
        job.job = schedule.scheduleJob(trigger, action);
    }
}


let scheduled = null;

function turnOnIfNeeded() {
    if(scheduled) {
        clearTimeout(scheduled);
        scheduled = null;
    }
    scheduled = setTimeout(doTurn, 10*1000);

    function doTurn() {
        const now = new Date().getHours();
        if((now >= jobs.on.time) && (now < jobs.off.time)) {
            jobs.on.action();
        }
        else {
            jobs.off.action();
        }
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
