// config env vars
require("dotenv").config();

// app configs
const config = {};

config.SERVER_PORT = Number.parseInt(process.env.SERVER_PORT);

// export app config
module.exports = config;
