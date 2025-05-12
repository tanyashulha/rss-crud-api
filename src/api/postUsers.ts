import { ServerResponse, IncomingMessage } from 'node:http';
import { IUser } from '../interfaces/user.interface';
import { db } from '../db/db';
import { callMiddleware } from '../middleware/middleware';
import { v4 as uuidv4 } from 'uuid';
import { MessagesEnum } from '../enums/messages.enum';
import { StatusCodesEnum } from '../enums/status-codes.enum';
import { validateUserObj } from '../validators/validate-user-obj.validator';
import { CustomError } from '../utils/custom-error.utils';
import { getResponse } from '../utils/get-response.utils';
import { generateError } from '../utils/generate-error.utils';

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
    } catch (err) {
        generateError(err, res);
    }
};