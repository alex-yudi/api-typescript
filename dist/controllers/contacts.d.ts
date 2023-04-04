import { Response } from 'express';
import { RequestUser } from '../middlewares/userAuthentication';
export declare const registerContact: (req: RequestUser, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getListOfContacts: (req: RequestUser, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateContact: (req: RequestUser, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteContact: (req: RequestUser, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
