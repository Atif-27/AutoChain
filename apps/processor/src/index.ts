import express from "express";
import { prisma } from "@repo/db";
import { Kafka } from "kafkajs";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

let producer: any;
let redis: any;

// ------------------------------------------------------------
// Queue Setup
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// Outbox Worker
// ------------------------------------------------------------

async function main() {
    try {
        if (!isProd) {
            await producer.connect();
        }

        console.log("Starting Outbox Worker...");

        while (true) {
            try {
                const pendingRows = await prisma.zapRunOutBox.findMany({
                    take: 10,
                });

                // Nothing to process
                if (pendingRows.length === 0) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, 1000)
                    );

                    continue;
                }

                console.log(
                    `Found ${pendingRows.length} pending events.`
                );

                // ----------------------------------------------------
                // Production -> Redis
                // ----------------------------------------------------

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
                }

                // ----------------------------------------------------
                // Development -> Kafka
                // ----------------------------------------------------

                else {
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

                // ----------------------------------------------------
                // Remove Successfully Published Events
                // ----------------------------------------------------

                await prisma.zapRunOutBox.deleteMany({
                    where: {
                        id: {
                            in: pendingRows.map(
                                (row: any) => row.id
                            ),
                        },
                    },
                });

                console.log("Successfully published events.");
            } catch (error) {
                console.error("Worker Error:", error);

                await new Promise((resolve) =>
                    setTimeout(resolve, 5000)
                );
            }
        }
    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

// ------------------------------------------------------------
// Express Server (Render Health Checks)
// ------------------------------------------------------------

const app = express();

app.get("/", (_, res) => {
    res.send("Outbox Worker is running.");
});

app.get("/health", (_, res) => {
    res.status(200).json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`HTTP Server listening on port ${PORT}`);
});

// ------------------------------------------------------------
// Start Worker
// ------------------------------------------------------------

main().catch((error) => {
    console.error("Fatal Error:", error);
});