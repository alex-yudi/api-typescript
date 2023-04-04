"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.getListOfContacts = exports.registerContact = void 0;
const connection_1 = __importDefault(require("../services/connection"));
const registerContact = async (req, res) => {
    const { nome: name, email, telefone: telephone } = req.body;
    if (!name || !email || !telephone) {
        return res.status(400).json({ message: 'Os campos de nome, e-mail e telefone são obrigatórios!' });
    }
    const contactData = {
        nome: name,
        email,
        telefone: telephone,
        id_usuario: 0
    };
    if (req.user) {
        const { userLoggedId } = req.user;
        contactData.id_usuario = userLoggedId;
    }
    try {
        await (0, connection_1.default)('contatos').insert(contactData);
        return res.status(201).json();
    }
    catch (error) {
        if (error.constraint === "contatos_email_key") {
            return res.status(409).json({ message: "Não é permitido o cadastro de e-mails repetidos!" });
        }
        if (error.constraint === "contatos_telefone_key") {
            return res.status(409).json({ message: "Não é permitido o cadastro de telefones repetidos!" });
        }
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};
exports.registerContact = registerContact;
const getListOfContacts = async (req, res) => {
    if (req.user) {
        const { userLoggedId } = req.user;
        try {
            const listOfcontacts = await (0, connection_1.default)('contatos').where({ id_usuario: userLoggedId });
            return res.status(200).json({ list: [...listOfcontacts] });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
};
exports.getListOfContacts = getListOfContacts;
const updateContact = async (req, res) => {
    if (req.user) {
        const { userLoggedId } = req.user;
        const { id: idContact } = req.params;
        const contactDataModified = req.body;
        const paramsToSearch = {
            id: idContact,
            id_usuario: userLoggedId,
        };
        try {
            const contactToBeModified = await (0, connection_1.default)('contatos')
                .select('nome', 'email', 'telefone')
                .where(paramsToSearch)
                .first();
            if (!contactToBeModified) {
                return res.status(404).json({ message: "Contato não localizado!" });
            }
            if (Object.keys(contactDataModified).length === 0) {
                return res.status(400).json({ message: 'É necessário informar algum campo para a alteração!' });
            }
            const isFieldValid = Object.keys(contactDataModified).every((field) => {
                return field === 'nome' || field === 'email' || field === 'telefone';
            });
            if (!isFieldValid) {
                return res.status(406).json({ message: 'Um ou todos os campos informados são inválidos!' });
            }
            const dataToBeSend = {
                ...contactToBeModified,
                ...contactDataModified
            };
            const [contactModified] = await (0, connection_1.default)('contatos')
                .update(dataToBeSend)
                .where(paramsToSearch)
                .returning(['id', 'nome', 'email', 'telefone']);
            return res.status(200).json(contactModified);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
};
exports.updateContact = updateContact;
const deleteContact = async (req, res) => {
    if (req.user) {
        const { userLoggedId } = req.user;
        const { id: idContact } = req.params;
        const paramsToSearch = {
            id: idContact,
            id_usuario: userLoggedId,
        };
        try {
            const contactToBeDeleted = await (0, connection_1.default)('contatos')
                .select('nome', 'email', 'telefone')
                .where(paramsToSearch)
                .first();
            if (!contactToBeDeleted) {
                return res.status(404).json({ message: "Contato não localizado!" });
            }
            await (0, connection_1.default)('contatos')
                .delete()
                .where(paramsToSearch);
            return res.status(200).json({ message: 'Contato deletado!' });
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
};
exports.deleteContact = deleteContact;
//# sourceMappingURL=contacts.js.map