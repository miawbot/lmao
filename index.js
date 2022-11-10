require('dotenv').config();

const path = require('path');
global.__root = path.resolve(__dirname);

const { Client } = require('./structures/client');
const client = new Client();

client.init();