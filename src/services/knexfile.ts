import { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: process.env.BD_HOST,
        port: Number(process.env.BD_PORT),
        user: process.env.BD_USER,
        password: process.env.BD_PASS,
        database: process.env.BD_DATABASE
    }
};

export default config;