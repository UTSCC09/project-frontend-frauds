// config env vars
import dotenv from "dotenv";

dotenv.config();

// app configs
const config = {};

// META CONFIGS
config.AIRTORONTO_BACKEND_URL = process.env.AIRTORONTO_BACKEND_URL;
config.APP_ENV = process.env.APP_ENV;
config.SERVER_PORT = Number.parseInt(process.env.SERVER_PORT);

// MONGO CONFIGS
config.MONGO_DB_USER = process.env.MONGO_DB_USER;
config.MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
config.MONGO_DB_DATABASE = process.env.MONGO_DB_DATABASE;
config.MONGO_DB_HOST = process.env.MONGO_DB_HOST;
config.MONGO_DB_PORT = process.env.MONGO_DB_PORT;
config.MONGO_DB_URI = `mongodb://${config.MONGO_DB_USER}:${config.MONGO_DB_PASSWORD}@${config.MONGO_DB_HOST}:${config.MONGO_DB_PORT}`;
config.CLIENT_ID = process.env.CLIENT_ID;
config.CLIENT_SECRET = process.env.CLIENT_SECRET;
config.SECRET = process.env.SECRET;

// REDIS CONFIGS
config.REDIS_HOST = process.env.REDIS_HOST;
config.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
config.REDIS_PORT = Number.parseInt(process.env.REDIS_PORT);

// QUEUE WORKER CONFIGS
config.EVENT_WORKERS = Number.parseInt(process.env.EVENT_WORKERS);
config.WEBHOOK_WORKERS = Number.parseInt(process.env.WEBHOOK_WORKERS);

// export app config
export default config;
