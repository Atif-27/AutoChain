
import { Kafka } from "kafkajs";
import { prisma } from "./lib/prisma";
import { parse } from "./parser";
import { JsonObject } from "@prisma/client/runtime/library";
import { sendEmail } from "@repo/mailer-config";
import dotenv from "dotenv";

type parsedType = { zapRunId: string, stage: number; };
dotenv.config();
const TOPIC = 'zap-events';
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ["localhost:9092"]
});
async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' });
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC, fromBeginning: true });
    const producer = kafka.producer();
    await producer.connect();


    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            });

            const parsedMessage = JSON.parse(message.value?.toString() || "{}") as parsedType;
            if (!parsedMessage) { return; }
            const zapRunId = parsedMessage.zapRunId;
            const currStage = parsedMessage.stage;

            const zapRunDetails = await prisma.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap: {
                        include: {
                            action: {
                                include: {
                                    type: true
                                },
                                orderBy: {
                                    sortingOrder: 'asc'
                                }
                            }
                        }
                    }
                }
            });

            const zapRunMetadata = zapRunDetails?.metadata;
            const actions = zapRunDetails?.zap.action;
            const currentAction = actions?.[currStage];

            const lastStage = (zapRunDetails?.zap.action?.length || 1) - 1; // 1
            console.log("Last Stage =", lastStage);
            console.log("Stage = ", currStage);


            //! perform action
            console.log("ACTION NO:", currentAction?.sortingOrder);

            if (currentAction && currentAction.type.id === "gmail") {
                const body = parse(
                    (currentAction.metadata as JsonObject)?.body as string,
                    zapRunMetadata,
                );
                const to = parse(
                    (currentAction.metadata as JsonObject)?.email as string,
                    zapRunMetadata,
                );
                console.log(`Sending out email to ${to} and the email body is ${body}`);
                await sendEmail(to, body, "normal");
            }


            console.log("processing done");
            //!  insert for next stage
            if (lastStage !== currStage) {
                console.log("pushing back to the queue");
                await producer.send({
                    topic: TOPIC,
                    messages: [
                        {
                            value: JSON.stringify({
                                stage: currStage + 1,
                                zapRunId,
                            }),
                        },
                    ],
                });
            }
            await new Promise((r) => setTimeout(r, 5000));

            await consumer.commitOffsets([
                {
                    topic: TOPIC,
                    partition: partition,
                    offset: (parseInt(message.offset) + 1).toString(),
                },
            ]);
        },
    });
}


main();