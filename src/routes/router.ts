require('dotenv').config();
import express from "express";
import { registerContact, getListOfContacts, updateContact } from "../controllers/contacts";
import { signUpUser, signInUser } from "../controllers/users";
import { userAuthentication } from "../middlewares/userAuthentication";

const routes = express();
routes.use(express.json())

routes.post('/usuario', signUpUser);
routes.post('/login', signInUser);

routes.use(userAuthentication)

routes.post('/contatos', registerContact);
routes.get('/contatos', getListOfContacts)
routes.put('/contatos/:id', updateContact)

export default routes;
