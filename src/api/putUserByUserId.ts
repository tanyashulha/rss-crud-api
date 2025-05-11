import { ServerResponse, IncomingMessage } from 'node:http';
import { db } from '../db/db';
import { IUser } from '../interfaces/user.interface';
import { callMiddleware } from '../middleware/middleware';

export const putUserByUserId = async (id: string, res: ServerResponse, req: IncomingMessage) => {
    try {
        if (db.isAlreadyExist(id)) {
            const user = await getResponse(req);
            db.put(user as IUser, id);
            callMiddleware(res, 200, user);
        } else {
            // 404
            console.log('User is not exsist')
        }
    } catch (err) {
        console.log(err)
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