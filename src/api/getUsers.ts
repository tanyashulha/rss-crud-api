import { ServerResponse } from 'node:http';
import { callMiddleware } from '../middleware/middleware';
import { db } from '../db/db';

export const getUsers = (res: ServerResponse) => {
    const arr = Array.from(db.read().values());
    callMiddleware(res, 200, arr);
};