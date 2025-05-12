import { IncomingMessage } from 'node:http';

export const getResponse = (req: IncomingMessage): Promise<unknown> =>
    new Promise((resolve, reject) => {
    const arr: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
        arr.push(chunk);
    });
    req.on('end', () => {
        try {
            const user = JSON.parse(Buffer.concat(arr).toString()) as unknown;
            resolve(user);
        } catch (err) {
            reject(err);
        }
    });
});