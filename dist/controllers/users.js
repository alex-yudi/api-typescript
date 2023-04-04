"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInUser = exports.signUpUser = void 0;
const connection_1 = __importDefault(require("../services/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authToken_1 = __importDefault(require("../services/authToken"));
const signUpUser = async (req, res) => {
    const { nome: name, email, senha: password } = req.body;
    if (name && !email && !password) {
        return res.status(400).json('Os campos e-mail e senha são obrigatórios!');
    }
    if (!name && email && !password) {
        return res.status(400).json('Os campos nome e senha são obrigatórios!');
    }
    if (!name && !email && password) {
        return res.status(400).json('Os campos nome e e-mail são obrigatórios!');
    }
    if (!name && email && password) {
        return res.status(400).json('O campo nome é obrigatório!');
    }
    if (name && !email && password) {
        return res.status(400).json('O campo e-mail é obrigatório!');
    }
    if (name && email && !password) {
        return res.status(400).json('O campo senha é obrigatório!');
    }
    if (!name && !email && !password) {
        return res.status(400).json('Todos os campos são obrigatórios!');
    }
    try {
        const passwordCrypt = await bcrypt_1.default.hash(password, 10);
        const userData = { nome: name, email, senha: passwordCrypt };
        const [responseUserCreated] = await (0, connection_1.default)('usuarios')
            .insert(userData)
            .returning('*');
        const userCreated = {
            id: responseUserCreated.id,
            nome: responseUserCreated.nome,
            email: responseUserCreated.email
        };
        return res.status(201).json(userCreated);
    }
    catch (error) {
        if (error.constraint === "usuarios_email_key") {
            return res.status(409).json({ message: "Usuário já cadastrado no sistema!" });
        }
        return res.status(400).json(error);
    }
};
exports.signUpUser = signUpUser;
const signInUser = async (req, res) => {
    const { email, senha: password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Os campos e-mail e senha são obrigatórios!' });
    }
    try {
        const [locatedUser] = await (0, connection_1.default)('usuarios').where({ email });
        if (!locatedUser) {
            return res.status(401).json({ message: 'E-mail ou senha incorreto!' });
        }
        const comparePasswords = await bcrypt_1.default.compare(password, locatedUser.senha);
        if (!comparePasswords) {
            return res.status(401).json({ message: 'E-mail ou senha incorreto!' });
        }
        const token = await jsonwebtoken_1.default.sign({ id: locatedUser.id }, authToken_1.default, { expiresIn: '8h' });
        const { senha: __, ...userLogged } = locatedUser;
        const responseWillSend = {
            user: userLogged,
            token
        };
        return res.status(200).json(responseWillSend);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.signInUser = signInUser;
//# sourceMappingURL=users.js.map