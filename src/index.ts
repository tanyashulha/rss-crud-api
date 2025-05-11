import 'dotenv/config';
import { createServer } from 'http';
import { MethodsEnum } from './enums/methods.enum';
import { deleteUserByUserId } from './api/deleteUserByUserId';
import { getUsers } from './api/getUsers';
import { postUsers } from './api/postUsers';
import { putUserByUserId } from './api/putUserByUserId';
import { callMiddleware } from './middleware/middleware';
import { getUserById } from './api/getUserById';

const PORT = process.env.PORT;

export const main = createServer((req, res) => {
    const urlPaths = req.url?.split('/');
    const id = urlPaths?.at(3);

    if (id) {
        switch (req.method) {
            case MethodsEnum.GET:
                getUserById(res, id);
                break;
            case MethodsEnum.PUT:
                putUserByUserId(id, res, req).catch(() =>
                    callMiddleware(res, 500, { message: 'Server error' })
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
                callMiddleware(res, 500, { message: 'Server error' })
            );
            break;
        default:
            throw new Error();
    }
   
}).listen(PORT, () => {
    console.log(`Server is on ${PORT}`);
});