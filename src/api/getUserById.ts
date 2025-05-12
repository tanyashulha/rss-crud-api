import { ServerResponse, IncomingMessage } from 'http';
import { db } from '../db/db';
import { callMiddleware } from '../middleware/middleware';
import { validate } from 'uuid';
import { CustomError } from '../utils/custom-error.utils';
import { MessagesEnum } from '../enums/messages.enum';
import { StatusCodesEnum } from '../enums/status-codes.enum';
import { generateError } from '../utils/generate-error.utils';

export const getUserById = (res: ServerResponse<IncomingMessage>, id: string) => {
    try {
        if (validate(id)) {
            if (db.isAlreadyExist(id)) {
                const user = db.get(id);
                callMiddleware(res, StatusCodesEnum.SUCCESS, user);
            } else {
                throw new CustomError(StatusCodesEnum.NOT_FOUND, MessagesEnum.UserIsNotExsist);
            }
        } else {
            throw new CustomError(StatusCodesEnum.BAD_REQUEST, MessagesEnum.UserIdIsInvalid);
        }
    } catch (err) {
        generateError(err, res);
    }
};