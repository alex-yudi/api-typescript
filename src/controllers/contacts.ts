import { Request, Response } from 'express'
import knex from '../services/connection';

export const registerContact = async (req: Request, res: Response) => {
    const { nome: name, email, telefone: telephone } = req.body;

    if (!name || !email || !telephone) {
        return res.status(400).json({ message: 'Os campos de nome, e-mail e telefone são obrigatórios!' })
    }

    try {

    } catch (error) {

    }


    return res.send('ok')
}