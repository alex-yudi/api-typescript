import { Request, Response } from 'express'
import knex from "../services/connection";
import bcrypt from 'bcrypt'

export const signUpUser = async (req: Request, res: Response) => {
    const { nome: name, email, senha: password } = req.body;

    if (name && !email && !password) {
        return res.status(400).json('Os campos e-mail e senha são obrigatórios!')
    }
    if (!name && email && !password) {
        return res.status(400).json('Os campos nome e senha são obrigatórios!')
    }
    if (!name && !email && password) {
        return res.status(400).json('Os campos nome e e-mail são obrigatórios!')
    }

    if (!name && email && password) {
        return res.status(400).json('O campo nome é obrigatório!')
    }
    if (name && !email && password) {
        return res.status(400).json('O campo e-mail é obrigatório!')
    }
    if (name && email && !password) {
        return res.status(400).json('O campo senha é obrigatório!')
    }

    if (!name && !email && !password) {
        return res.status(400).json('Todos os campos são obrigatórios!')
    }

    try {
        const passwordCrypt = await bcrypt.hash(password, 10)

        const userData = { nome: name, email, senha: passwordCrypt }

        const [responseUserCreated] = await knex('usuarios')
            .insert(userData)
            .returning('*')

        const userCreated = {
            id: responseUserCreated.id,
            nome: responseUserCreated.nome,
            email: responseUserCreated.email
        }

        return res.status(201).json(userCreated)
    } catch (error: any) {
        return res.status(400).json(error.message)
    }
}