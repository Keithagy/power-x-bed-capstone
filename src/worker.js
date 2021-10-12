require('dotenv').config();
const amqplib = require('amqplib');

const db = require('./db')(async () => await db.initialise())();

const listAccessorService = require('./services/listAccessor');
const listAccessorServiceInstance = listAccessorService(db);

const authService = require('./services/auth');
const authServiceInstance = authService(db);

const URL = 'amqp://localhost:5672';
const QUEUE = 'NewAccess';

async function main() {
    const client = await amqplib.connect(URL);
    const channel = await client.createChannel();
    await channel.assertQueue(QUEUE);
    channel.consume(QUEUE, (msg) => {
        const { listId, newAccessEmail } = JSON.parse(msg.content);
        console.log('Received:', listId, newAccessEmail);
        const newAccessUid = await authServiceInstance.getUidByEmail(
            newAccessEmail
        );
        if (!newAccessUid && newAccessUid !== 0) {
            console.log('Invalid email provided');
            channel.ack(msg);
            return;
        }

        listAccessorServiceInstance
            .addAccessor(listId, newAccessUid)
            .then((accessorIds) => {
                console.log(`Accessor Ids for list ${listId}: ${accessorIds}`);
                channel.ack(msg);
            })
            .catch((err) => {
                channel.nack(msg);
            });
    });
}

main().catch((err) => {
    console.log(err);
});
