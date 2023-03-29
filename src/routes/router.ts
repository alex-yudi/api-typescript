require('dotenv').config();
import express from "express";
import { signUpUser, signInUser } from "../controllers/users";

const routes = express();
routes.use(express.json())

routes.post('/usuario', signUpUser);
routes.post('/login', signInUser);

export default routes;
