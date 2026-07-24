import express from "express";
import { Kafka } from "kafkajs";
import { Redis } from "@upstash/redis";
import { prisma } from "./lib/prisma";
import { parse } from "./parser";
import { JsonObject } from "@prisma/client/runtime/library";
import { sendEmail } from "@repo/mailer-config";
import dotenv from "dotenv";

dotenv.config();

type ParsedType = {
    zapRunId: string;
    stage: number;
};

const TOPIC = "zap-events";
const isProd = process.env.NODE_ENV === "production";

let producer: any;
let consumer: any;
let redis: Redis | null = null;

// ----------------------------------------------------------------
// Setup Queue
// ----------------------------------------------------------------

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

    consumer = kafka.consumer({
        groupId: "main-worker",
    });
}

// ----------------------------------------------------------------
// Process Job
// ----------------------------------------------------------------

async function processMessage(
    parsedMessage: ParsedType,
    pushNextStage: (payload: ParsedType) => Promise<void>
) {
    const { zapRunId, stage: currStage } = parsedMessage;

    const zapRunDetails = await prisma.zapRun.findFirst({
        where: {
            id: zapRunId,
        },
        include: {
            zap: {
                include: {
                    action: {
                        include: {
                            type: true,
                        },
                        orderBy: {
                            sortingOrder: "asc",
                        },
                    },
                },
            },
        },
    });

    const zapRunMetadata = zapRunDetails?.metadata;

    const actions = zapRunDetails?.zap.action;

    const currentAction = actions?.[currStage];

    const lastStage = (actions?.length || 1) - 1;

    console.log("Last Stage =", lastStage);
    console.log("Current Stage =", currStage);
    console.log("ACTION NO =", currentAction?.sortingOrder);

    // ------------------------------------------------------------
    // Perform Action
    // ------------------------------------------------------------

    if (currentAction?.type.id === "gmail") {
        const body = parse(
            (currentAction.metadata as JsonObject)?.body as string,
            zapRunMetadata
        );

        const to = parse(
            (currentAction.metadata as JsonObject)?.email as string,
            zapRunMetadata
        );

        console.log(
            `Sending email to ${to} and the body is:\n${body}`
        );

        await sendEmail(to, body, "normal");
    }

    console.log("Processing completed.");

    // ------------------------------------------------------------
    // Push Next Stage
    // ------------------------------------------------------------

    if (lastStage !== currStage) {
        console.log("Pushing next stage to queue...");

        await pushNextStage({
            zapRunId,
            stage: currStage + 1,
        });
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
}

// ----------------------------------------------------------------
// Worker
// ----------------------------------------------------------------

async function main() {
    // ============================================================
    // PRODUCTION -> REDIS
    // ============================================================

    if (isProd) {
        console.log("Starting Redis worker...");

        while (true) {
            try {
                const message = await redis!.lpop<ParsedType>(TOPIC);

                if (!message) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, 1000)
                    );

                    continue;
                }

                console.log("Received:", message);

                await processMessage(message, async (payload) => {
                    await redis!.rpush(TOPIC, payload);
                });
            } catch (error) {
                console.error("Worker Error:", error);

                await new Promise((resolve) =>
                    setTimeout(resolve, 5000)
                );
            }
        }
    }

    // ============================================================
    // DEVELOPMENT -> KAFKA
    // ============================================================

    await consumer.connect();

    await consumer.subscribe({
        topic: TOPIC,
        fromBeginning: true,
    });

    await producer.connect();

    await consumer.run({
        autoCommit: false,

        eachMessage: async ({
            topic,
            partition,
            message,
        }: any) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            });

            const parsedMessage = JSON.parse(
                message.value?.toString() || "{}"
            ) as ParsedType;

            if (!parsedMessage) {
                return;
            }

            await processMessage(
                parsedMessage,
                async (payload) => {
                    await producer.send({
                        topic: TOPIC,
                        messages: [
                            {
                                value: JSON.stringify(payload),
                            },
                        ],
                    });
                }
            );

            await consumer.commitOffsets([
                {
                    topic,
                    partition,
                    offset: (
                        parseInt(message.offset) + 1
                    ).toString(),
                },
            ]);
        },
    });
}

// ----------------------------------------------------------------
// Express Server (for Render Health Checks)
// ----------------------------------------------------------------

const app = express();

app.get("/", (_, res) => {
    res.send("Worker is running.");
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

// ----------------------------------------------------------------
// Start Worker
// ----------------------------------------------------------------

main().catch((error) => {
    console.error("Fatal Error:", error);
});