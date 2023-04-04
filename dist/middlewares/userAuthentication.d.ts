import { NextFunction, Request, Response } from 'express';
export interface RequestUser extends Request {
    user?: {
        userLoggedId: number;
    };
}
export declare const userAuthentication: (req: RequestUser, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
