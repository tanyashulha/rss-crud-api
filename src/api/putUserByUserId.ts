import { ServerResponse, IncomingMessage } from 'node:http';
import { db } from '../db/db';
import { IUser } from '../interfaces/user.interface';
import { callMiddleware } from '../middleware/middleware';
import { validate } from 'uuid';
import { CustomError } from '../utils/custom-error.utils';
import { MessagesEnum } from '../enums/messages.enum';
import { StatusCodesEnum } from '../enums/status-codes.enum';
import { validateUserObj } from '../validators/validate-user-obj.validator';

export const putUserByUserId = async (id: string, res: ServerResponse, req: IncomingMessage) => {
    try {
        if (validate(id)) {
            if (db.isAlreadyExist(id)) {
                const user = await getResponse(req) as IUser;
                if (validateUserObj(user)) {
                    db.put(user as IUser, id);
                    callMiddleware(res, StatusCodesEnum.SUCCESS, user);
                } else {
                    throw new CustomError(StatusCodesEnum.BAD_REQUEST, MessagesEnum.InvalidDataInRequest);
                }
            } else {
                throw new CustomError(StatusCodesEnum.NOT_FOUND, MessagesEnum.UserIsNotExsist);
            }
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