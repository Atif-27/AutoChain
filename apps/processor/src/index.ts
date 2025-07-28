import { prisma } from "@repo/db";
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ["localhost:9092"]
});


async function main() {
    try {
        const producer = kafka.producer();
        await producer.connect();

        while (1) {
            const pendingRows = await prisma.zapRunOutBox.findMany({
                where: {},
                take: 10
            });
            console.log(pendingRows);

            await producer.send({
                topic: 'zap-events',
                messages: pendingRows.map((row) => ({
                    value: JSON.stringify({
                        zapRunId: row.zapRunId,
                        stage: 0
                    })
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
    } catch (error) {
        console.log(error);
    } finally {
        await new Promise((r) => setTimeout(r, 3000));
    }
}

main();
