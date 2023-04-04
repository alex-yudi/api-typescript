import { Request, Response } from 'express'
import knex from "../services/connection";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import authToken from '../services/authToken';


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
        if (error.constraint === "usuarios_email_key") {
            return res.status(409).json({ message: "Usuário já cadastrado no sistema!" })
        }
        return res.status(400).json(error)
    }
}

export const signInUser = async (req: Request, res: Response) => {
    const { email, senha: password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Os campos e-mail e senha são obrigatórios!' })
    }

    try {
        const [locatedUser] = await knex('usuarios').where({ email })
        if (!locatedUser) {
            return res.status(401).json({ message: 'E-mail ou senha incorreto!' })
        }

        const comparePasswords = await bcrypt.compare(password, locatedUser.senha)
        if (!comparePasswords) {
            return res.status(401).json({ message: 'E-mail ou senha incorreto!' })
        }

        const token = await jwt.sign({ id: locatedUser.id }, authToken, { expiresIn: '8h' });

        const { senha: __, ...userLogged } = locatedUser;
        const responseWillSend = {
            user: userLogged,
            token
        }
        return res.status(200).json(responseWillSend)
    } catch (error: any) {
        return res.status(500).json({ message: error.message })
    }
}