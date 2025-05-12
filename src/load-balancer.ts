import cluster, { Worker } from 'cluster';
import { createServer, IncomingMessage, request, ServerResponse } from 'http';
import { availableParallelism, hostname } from 'os';
import { MessagesEnum } from './enums/messages.enum';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

export const loadBalancer = async () => {
    const cpus = availableParallelism();
    const workers: { port: number; worker: Worker }[] = [];
    let current: number = 0;

    if (cluster.isPrimary) {
        console.log(`Master ${process.pid} is running`);

        for (let i = 0; i < cpus; i++) {
            const newPort = PORT + i;
            const worker = cluster.fork({ WORKER_PORT: newPort });
            workers.push({ port: newPort, worker });
        }

        cluster.on('exit', (worker) => {
            console.log(`${MessagesEnum.WorkerWasKilled} ${worker.process.pid}`);
            cluster.fork();
        });

        createServer((req: IncomingMessage, res: ServerResponse) => {
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

            req.pipe(
                request(options, (response) => {
                    res.writeHead(response.statusCode!, response.headers);
                    response.pipe(res);
                }),
            );
        }).listen(PORT, () => {
            console.log(`${MessagesEnum.LoadBalancerIsRunningOnPort} ${PORT}`);
        });
    } else {
        console.log(`Worker ${process.pid} started`);
    } 
}