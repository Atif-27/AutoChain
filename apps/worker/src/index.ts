
import { Kafka } from "kafkajs";
const TOPIC = 'zap-events';
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ["localhost:9092"]
});
async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' });
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC, fromBeginning: true });
    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            });

            await new Promise((r) => setTimeout(r, 5000));
            await consumer.commitOffsets([{
                topic: TOPIC,
                partition,
                offset: (parseInt(message.offset) +1).toString()
            }]);
        },
    });
}


main();