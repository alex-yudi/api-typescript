require('dotenv').config();
import express from "express";
import knex from "../services/connection";

const routes = express();
routes.use(express.json())

routes.get('/', async (req, res) => {
    const response = await knex('usuarios');


    return res.json(response)
})

export default routes;
