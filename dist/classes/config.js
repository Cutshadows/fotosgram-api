"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const config = {
    PORT: env_1.env.PORT,
    db_user: env_1.env.DB_USER,
    db_name: env_1.env.DB_NAME,
    db_host: env_1.env.DB_HOST,
    db_port: env_1.env.DB_PORT
};
exports.default = config;
