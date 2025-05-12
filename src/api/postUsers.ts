import { ServerResponse, IncomingMessage } from 'node:http';
import { IUser } from '../interfaces/user.interface';
import { db } from '../db/db';
import { callMiddleware } from '../middleware/middleware';
import { v4 as uuidv4 } from 'uuid';
import { MessagesEnum } from '../enums/messages.enum';
import { StatusCodesEnum } from '../enums/status-codes.enum';
import { validateUserObj } from '../validators/validate-user-obj.validator';
import { CustomError } from '../utils/custom-error.utils';

export const postUsers = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const user = await getResponse(req);
        const updatedUser = JSON.parse(JSON.stringify(user)) as IUser;

        if (validateUserObj(updatedUser)) {
            const userId = uuidv4();
            updatedUser.id = userId;
            db.set(updatedUser, userId);
            callMiddleware(res, StatusCodesEnum.CREATE, updatedUser);
        } else {
            throw new CustomError(StatusCodesEnum.BAD_REQUEST, MessagesEnum.InvalidDataInRequest);
        }
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