require('dotenv').config();
import express from "express";
import { signUpUser } from "../controllers/users";

const routes = express();
routes.use(express.json())

routes.post('/usuario', signUpUser)

export default routes;
