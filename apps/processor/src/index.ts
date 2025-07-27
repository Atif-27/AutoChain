import { prisma } from "@repo/db";
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
      brokers: ["localhost:9092"]
});


async function main() {
    const producer = kafka.producer();
    await producer.connect();

    while (1) {
        const pendingRows = await prisma.zapRunOutBox.findMany({
            where: {},
            take: 10
        });
        
        await producer.send({
            topic: 'zap-events',
            messages: pendingRows.map((row) => ({
                    value: row.zapRunId
                }))
        });

        await prisma.zapRunOutBox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map((r) => r.id)
                }
            }
        });
    }
}

main().catch(err => console.log(err));
