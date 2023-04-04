"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const contacts_1 = require("../controllers/contacts");
const users_1 = require("../controllers/users");
const userAuthentication_1 = require("../middlewares/userAuthentication");
const routes = (0, express_1.default)();
routes.post('/usuario', users_1.signUpUser);
routes.post('/login', users_1.signInUser);
routes.use(userAuthentication_1.userAuthentication);
routes.post('/contatos', contacts_1.registerContact);
routes.get('/contatos', contacts_1.getListOfContacts);
routes.put('/contatos/:id', contacts_1.updateContact);
routes.delete('/contatos/:id', contacts_1.deleteContact);
exports.default = routes;
//# sourceMappingURL=router.js.map