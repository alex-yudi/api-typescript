import express from 'express';
import dotenv from 'dotenv';
import knex from './services/connection'

dotenv.config();

const app = express();

app.get('/', async (req, res) => {

    const response = await knex('usuarios')
    console.log(response)
    return res.send('ok')
})

app.listen(process.env.PORT)