import { ServerResponse, IncomingMessage } from 'node:http';
import { StatusCodesEnum } from '../enums/status-codes.enum';
import { callMiddleware } from '../middleware/middleware';
import { CustomError } from './custom-error.utils';
import { MessagesEnum } from 'enums/messages.enum';

export const generateError = (err: unknown, res: ServerResponse<IncomingMessage>) => {
    if (err instanceof CustomError) {
        callMiddleware(res, err.code, { message: err.message });
    } else {
        callMiddleware(res, StatusCodesEnum.SERVER_ERROR, { message: MessagesEnum.InternalServerError });
    }
};