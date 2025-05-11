import { ServerResponse, IncomingMessage } from 'http';

export const callMiddleware = (res: ServerResponse<IncomingMessage>, code: number, message: unknown = null) => {
  res.writeHead(code, { 'Content-type': 'application/json' });
  res.end(JSON.stringify(message));
};