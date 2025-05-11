import { ServerResponse, IncomingMessage } from 'http';
import { db } from '../db/db';
import { callMiddleware } from '../middleware/middleware';

export const getUserById = (res: ServerResponse<IncomingMessage>, id: string) => {
    try {
        if (db.isAlreadyExist(id)) {
            const user = db.get(id);
            callMiddleware(res, 200, user);
        }
    } catch (err) {
        console.log(err)
    }
};