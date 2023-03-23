import { Knex } from 'knex'

interface KnexConfig {
    [key: string]: object;
};
const knexConfig: KnexConfig = {
    local: {
        client: 'pg',
        connection: {
            filename: './dev.sqlite3'
        }
    }
};

module.exports = {
    client: "pg",
    connection: {
        host: process.env.BD_HOST,
        port: process.env.BD_PORT,
        user: process.env.BD_USER,
        password: process.env.BD_PASS,
        database: process.env.BD_DATABASE
    }

} as Knex.Config;
