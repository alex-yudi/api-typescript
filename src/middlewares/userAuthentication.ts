import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import authToken from '../services/authToken'

export interface RequestUser extends Request {
    user?: {
        userLoggedId: number;
    }
}

interface verifiedTokenId extends jwt.JwtPayload {
    id?: number;
}

export const userAuthentication = async (req: RequestUser, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    const auth = authorization?.split(' ')[1]

    if (!auth || auth === 'undefined') {
        return res.status(401).json({ message: 'Token inválido!' });
    }

    try {
        const tokenVerified = await jwt.verify(auth, authToken) as verifiedTokenId;

        req.user = {
            userLoggedId: Number(tokenVerified.id)
        }
        next();
    } catch (error: any) {
        if (error.message === 'invalid token') {
            return res.status(401).json({ message: "Token inválido!" })
        }

        return res.status(500).json('Token fornecido gerando erro inesperado do servidor.')
    }

}