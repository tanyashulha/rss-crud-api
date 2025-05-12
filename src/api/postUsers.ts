import { ServerResponse, IncomingMessage } from 'node:http';
import { IUser } from '../interfaces/user.interface';
import { db } from '../db/db';
import { callMiddleware } from '../middleware/middleware';
import { v4 as uuidv4 } from 'uuid';
import { MessagesEnum } from '../enums/messages.enum';
import { StatusCodesEnum } from '../enums/status-codes.enum';

export const postUsers = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const userObject = await getResponse(req);
        const updateUser = JSON.parse(JSON.stringify(userObject)) as IUser;
        const userId = uuidv4();
        updateUser.id = userId;
        db.set(updateUser, userId);
        callMiddleware(res, StatusCodesEnum.CREATE, updateUser);
    } catch {
        callMiddleware(res, StatusCodesEnum.SERVER_ERROR, { message: MessagesEnum.InternalServerError });
    }
};

export const getResponse = (req: IncomingMessage): Promise<unknown> =>
    new Promise((resolve, reject) => {
    const arrData: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
        arrData.push(chunk);
    });
    req.on('end', () => {
        try {
            const userObject = JSON.parse(Buffer.concat(arrData).toString()) as unknown;
            resolve(userObject);
        } catch (err) {
            reject(err);
        }
    });
});