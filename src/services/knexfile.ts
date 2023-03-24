import { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();


const connection = {
    host: process.env.BD_HOST,
    port: Number(process.env.BD_PORT),
    user: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_DATABASE
}

if (process.env.NODE_ENV === 'test') {
    connection.host = process.env.BD_TEST_HOST;
    connection.port = Number(process.env.BD_TEST_PORT);
    connection.user = process.env.BD_TEST_USER;
    connection.password = process.env.BD_TEST_PASS;
    connection.database = process.env.BD_TEST_DATABASE;
}


const config: Knex.Config = {
    client: 'pg',
    connection: connection
};


export default config;