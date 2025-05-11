import { db } from '../db/db';
import { callMiddleware } from '../middleware/middleware';
import { ServerResponse } from 'node:http';

export const deleteUserByUserId = (res: ServerResponse, id: string) => {
    try {
        if (db.isAlreadyExist(id)) {
            db.delete(id);
            callMiddleware(res, 204);
        }
    } catch (err) {
        console.log(err)
    }
};