import { prisma } from "@repo/db";
import { Kafka } from "kafkajs";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();
const isProd = process.env.NODE_ENV === "production";

let producer: any;
let redis: any;

if (isProd) {
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
} else {
    const kafka = new Kafka({
        clientId: "my-app",
        brokers: ["localhost:9092"],
    });

    producer = kafka.producer();
}


async function main() {
    try {
        if (!isProd) {
            await producer.connect();
        }

        while (1) {
            const pendingRows = await prisma.zapRunOutBox.findMany({
                take: 10,
            });

            if (pendingRows.length === 0) {
                continue;
            }

            if (isProd) {
                for (const row of pendingRows) {
                    await redis.rpush(
                        "zap-events",
                        JSON.stringify({
                            zapRunId: row.zapRunId,
                            stage: 0,
                        })
                    );
                }
            } else {
                await producer.send({
                    topic: "zap-events",
                    messages: pendingRows.map((row: any) => ({
                        value: JSON.stringify({
                            zapRunId: row.zapRunId,
                            stage: 0,
                        }),
                    })),
                });
            }

            await prisma.zapRunOutBox.deleteMany({
                where: {
                    id: {
                        in: pendingRows.map((r: any) => r.id),
                    },
                },
            });
        }
    } catch (error) {
        console.log(error);
    }
}

main();