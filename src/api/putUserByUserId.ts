import { ServerResponse, IncomingMessage } from 'node:http';
import { db } from '../db/db';
import { IUser } from '../interfaces/user.interface';
import { callMiddleware } from '../middleware/middleware';
import { validate } from 'uuid';
import { CustomError } from '../utils/custom-error.utils';
import { MessagesEnum } from '../enums/messages.enum';
import { StatusCodesEnum } from '../enums/status-codes.enum';
import { validateUserObj } from '../validators/validate-user-obj.validator';
import { getResponse } from '../utils/get-response.utils';
import { generateError } from '../utils/generate-error.utils';

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
    } catch (err) {
        generateError(err, res);
    }
};