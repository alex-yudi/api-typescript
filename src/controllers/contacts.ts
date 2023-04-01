import { Request, Response } from 'express'
import { RequestUser } from '../middlewares/userAuthentication'
import knex from '../services/connection';

export const registerContact = async (req: RequestUser, res: Response) => {
    const { nome: name, email, telefone: telephone } = req.body;

    if (!name || !email || !telephone) {
        return res.status(400).json({ message: 'Os campos de nome, e-mail e telefone são obrigatórios!' })
    }

    const contactData = {
        nome: name,
        email,
        telefone: telephone,
        id_usuario: 0
    }

    if (req.user) {
        const { userLoggedId } = req.user;
        contactData.id_usuario = userLoggedId;
    }


    try {
        await knex('contatos').insert(contactData);

        return res.status(201).json();
    } catch (error: any) {
        if (error.constraint === "contatos_email_key") {
            return res.status(400).json({ message: "Não é permitido o cadastro de e-mails repetidos!" })
        }
        if (error.constraint === "contatos_telefone_key") {
            return res.status(400).json({ message: "Não é permitido o cadastro de telefones repetidos!" })
        }

        return res.status(500).json({ message: "Erro interno do servidor." })
    }
}

export const getListOfContacts = async (req: RequestUser, res: Response) => {
    if (req.user) {

        const { userLoggedId } = req.user
        try {
            const listOfcontacts = await knex('contatos').where({ id_usuario: userLoggedId })

            return res.status(200).json({ list: [...listOfcontacts] })
        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }
}