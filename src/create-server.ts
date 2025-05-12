import { createServer } from 'http';
import { MethodsEnum } from './enums/methods.enum';
import { deleteUserByUserId } from './api/deleteUserByUserId';
import { getUsers } from './api/getUsers';
import { postUsers } from './api/postUsers';
import { putUserByUserId } from './api/putUserByUserId';
import { callMiddleware } from './middleware/middleware';
import { getUserById } from './api/getUserById';
import { StatusCodesEnum } from './enums/status-codes.enum';
import { MessagesEnum } from './enums/messages.enum';

export const server = createServer((req, res) => {
    const urlPaths = req.url?.split('/');
    const id = urlPaths?.at(3);
    
    if (urlPaths?.at(1) === 'api' && urlPaths.at(2) === 'users' && urlPaths.length < 5 && req.url && req.method) {
        if (id) {
            switch (req.method) {
                case MethodsEnum.GET:
                    getUserById(res, id);
                    break;
                case MethodsEnum.PUT:
                    putUserByUserId(id, res, req).catch(() =>
                        callMiddleware(res, StatusCodesEnum.SERVER_ERROR, { message: MessagesEnum.InternalServerError })
                    );
                    break;
                case MethodsEnum.DELETE:
                    deleteUserByUserId(res, id);
                    break;
                default:
                    throw new Error();
            }
    
            return;
        }
    
        switch (req.method) {
            case MethodsEnum.GET:
                getUsers(res);
                break;
            case MethodsEnum.POST:
                postUsers(req, res).catch(() =>
                    callMiddleware(res, StatusCodesEnum.SERVER_ERROR, { message: MessagesEnum.InternalServerError })
                );
                break;
            default:
                throw new Error();
        }
    }
});