import 'dotenv/config';
import { server } from './create-server';
import { loadBalancer } from './load-balancer';
import cluster from 'node:cluster';

const PORT = process.env.PORT;

if (process.env.MULTI === 'true' && cluster.isPrimary) {
    loadBalancer();
} else {
    server.listen(PORT, () => {
        console.log(`Server is on ${PORT}`);
    });
}