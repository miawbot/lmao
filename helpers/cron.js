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
     * @type {CronScheduleType|String}
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

        if (
            !data.name ||
            !data.callback
        ) {
            throw new Error('Cron module is missing properties');
        }

        this.schedule = data.schedule;

        if (typeof data.schedule === 'object') {
            this.schedule = Object.assign(new CronScheduleType(), data.schedule);
        }

        data = Object.assign(new CronType(), data);

        this.cron = cron;
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
    start(client) {
        let _schedule = this.schedule;

        if (typeof _schedule === 'object') {
            _schedule = Object.values(client.sanitize(_schedule)).join(' ');
        }

        this.cron.schedule(_schedule, async () => {
            await this.callback?.(client, this);
        })
    }
}

module.exports = { Cron, CronType, CronScheduleType };