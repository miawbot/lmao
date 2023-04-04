const cron = require('node-cron');

class CronScheduleType {
    /**
     * @type {String}
     */
    seconds = null;
    minutes = '*';
    hours = '*';
    dateOfMonth = '*';
    month = '*';
    dateOfWeek = '*';
}

class CronType {
    name = '';

    /**
     * @type {CronScheduleType}
     */
    schedule = {};

    /**
     * @type {Function}
     */
    callback = null;
}

class Cron extends CronType {

    /**
     * 
     * @param {CronType} data 
     */
    constructor(data) {
        super();

        this.cron = cron;
        this.active = false;

        if (
            !data.name ||
            !data.callback
        ) {
            throw new Error('Cron module is missing properties');
        }

        this.schedule = Object.assign(new CronScheduleType(), data.schedule);

        data = Object.assign(new CronType(), data);

        this.name = data.name;
        this.callback = data.callback;
    }

    /**
     * Start cronjob schedule
     * 
     * @param {Topokki} client 
     * @param {CronScheduleType} schedule 
     * @param {Function} callback 
     */
    scheduleStart(client, schedule, callback) {
        this.cron.schedule(Object.values(schedule).join(' '), async () => {
            await callback?.(client, schedule, this);
        })
    }

    /**
     * Start cronjob callback
     * 
     * @param {Topokki} client 
     */
    async start(client, schedule) {
        await this.callback?.(client, client.sanitize(schedule), this);
    }
}

module.exports = { Cron, CronType, CronScheduleType };