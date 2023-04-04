import { Request, Response } from 'express';
export declare const signUpUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const signInUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
