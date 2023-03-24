import express from 'express';
import dotenv from 'dotenv';

import knex from './services/connection'
import routes from './routes/router'

dotenv.config();

const app = express();

app.use(routes);

app.listen(process.env.PORT)