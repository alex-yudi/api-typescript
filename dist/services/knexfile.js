"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection = {
    host: process.env.BD_HOST,
    port: Number(process.env.BD_PORT),
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_DATABASE
};
if (process.env.NODE_ENV === 'test') {
    connection.host = process.env.BD_TEST_HOST;
    connection.port = Number(process.env.BD_TEST_PORT);
    connection.user = process.env.BD_TEST_USER;
    connection.password = process.env.BD_TEST_PASS;
    connection.database = process.env.BD_TEST_DATABASE;
}
const config = {
    client: 'pg',
    connection: connection
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map