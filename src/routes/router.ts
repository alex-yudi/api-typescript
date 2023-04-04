require('dotenv').config();
import express from "express";
import { registerContact, getListOfContacts, updateContact, deleteContact } from "../controllers/contacts";
import { signUpUser, signInUser } from "../controllers/users";
import { userAuthentication } from "../middlewares/userAuthentication";

const routes = express();

routes.post('/usuario', signUpUser);
routes.post('/login', signInUser);

routes.use(userAuthentication)

routes.post('/contatos', registerContact);
routes.get('/contatos', getListOfContacts)
routes.put('/contatos/:id', updateContact)
routes.delete('/contatos/:id', deleteContact)

export default routes;
