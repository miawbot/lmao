require('dotenv').config();

const { Client } = require('./structures/client');
const client = new Client();

client.init();