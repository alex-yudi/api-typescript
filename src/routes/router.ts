require('dotenv').config();
import express from "express";
import { registerContact } from "../controllers/contacts";
import { signUpUser, signInUser } from "../controllers/users";

const routes = express();
routes.use(express.json())

routes.post('/usuario', signUpUser);
routes.post('/login', signInUser);
routes.post('/usuarios', registerContact)

export default routes;
