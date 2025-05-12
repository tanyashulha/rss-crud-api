import cluster, { Worker } from 'cluster';
import { createServer, IncomingMessage, request, ServerResponse } from 'http';
import { availableParallelism, hostname } from 'os';
import { MessagesEnum } from './enums/messages.enum';
import { getResponse } from './utils/get-response.utils';
import { setResponse } from './utils/set-response.utils';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

export const loadBalancer = async () => {
    const cpus = availableParallelism();
    const workers: { port: number; worker: Worker }[] = [];
    let current: number = 0;

    for (let i = 1; i <= cpus; i++) {
        const newPort = PORT + i;
        const worker = cluster.fork({ WORKER_PORT: newPort });
        workers.push({ port: newPort, worker });
    }

    const server = createServer();

    server.listen(PORT, () => {
        console.log(`${MessagesEnum.LoadBalancerIsRunningOnPort} ${PORT}`);
    });

    server.on('request',
        async (req: IncomingMessage, res: ServerResponse) => {
            const worker = workers[current];
            const options = {
                hostname: hostname(),
                port: worker?.port,
                path: req?.url,
                method: req?.method,
                headers: req?.headers,
            };

            current += 1;
            if (current >= workers.length) current = 0;

            const LbRequest = request(options);
            const reqBody = await getResponse(req);
            LbRequest.end(reqBody);

            request(options).on("response", async (workerRes) => {
                const body = await getResponse(workerRes);
                const code = workerRes.statusCode || 200;
                const response = { code, body };

                setResponse(res, response);
            });
        }
    );

    cluster.on('exit', () => {
        console.log(`${MessagesEnum.WorkerWasKilled}`);
    });
};
