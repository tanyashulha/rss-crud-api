import { ServerResponse } from 'http';

export interface IResponse {
    code: number;
    body: unknown;
}

export const setResponse = (res: ServerResponse, response: IResponse) => {
    res.statusCode = response.code;

    if (response.body) {
        res.setHeader('Content-Type', 'application/json');
        res.end(response.body);
        return;
    }

    res.end();
}