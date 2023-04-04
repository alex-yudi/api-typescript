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
            return res.status(409).json({ message: "Não é permitido o cadastro de e-mails repetidos!" })
        }
        if (error.constraint === "contatos_telefone_key") {
            return res.status(409).json({ message: "Não é permitido o cadastro de telefones repetidos!" })
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

export const updateContact = async (req: RequestUser, res: Response) => {
    if (req.user) {
        const { userLoggedId } = req.user
        const { id: idContact } = req.params
        const contactDataModified = req.body
        const paramsToSearch = {
            id: idContact,
            id_usuario: userLoggedId,
        }

        try {
            const contactToBeModified = await knex('contatos')
                .select('nome', 'email', 'telefone')
                .where(paramsToSearch)
                .first()

            if (!contactToBeModified) {
                return res.status(404).json({ message: "Contato não localizado!" })
            }

            if (Object.keys(contactDataModified).length === 0) {
                return res.status(400).json({ message: 'É necessário informar algum campo para a alteração!' })
            }

            const isFieldValid = Object.keys(contactDataModified).every((field) => {
                return field === 'nome' || field === 'email' || field === 'telefone'
            })

            if (!isFieldValid) {
                return res.status(406).json({ message: 'Um ou todos os campos informados são inválidos!' })
            }

            const dataToBeSend = {
                ...contactToBeModified,
                ...contactDataModified
            }

            const [contactModified] = await knex('contatos')
                .update(dataToBeSend)
                .where(paramsToSearch)
                .returning(['id', 'nome', 'email', 'telefone'])

            return res.status(200).json(contactModified)
        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }
}

export const deleteContact = async (req: RequestUser, res: Response) => {
    if (req.user) {
        const { userLoggedId } = req.user
        const { id: idContact } = req.params
        const paramsToSearch = {
            id: idContact,
            id_usuario: userLoggedId,
        }

        try {
            const contactToBeDeleted = await knex('contatos')
                .select('nome', 'email', 'telefone')
                .where(paramsToSearch)
                .first()

            if (!contactToBeDeleted) {
                return res.status(404).json({ message: "Contato não localizado!" })
            }

            await knex('contatos')
                .delete()
                .where(paramsToSearch)

            return res.status(200).json({ message: 'Contato deletado!' })
        } catch (error: any) {
            return res.status(500).json({ message: "Erro interno do servidor." })
        }
    }
}