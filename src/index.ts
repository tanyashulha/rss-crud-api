import 'dotenv/config';
import { server } from './create-server';
import { loadBalancer } from './load-balancer';

const PORT = process.env.PORT;

if (process.env.MULTI === 'true') {
    loadBalancer();
} else {
    server.listen(PORT, () => {
        console.log(`Server is on ${PORT}`);
    });
}