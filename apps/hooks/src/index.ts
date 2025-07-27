import { prisma } from "./lib/prisma";
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log(body);

    await prisma.$transaction(async tx => {
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });

        await tx.zapRunOutBox.create({
            data: {
                zapRunId: run.id
            }
        });
    });
    // store in db a new trigger

    // push it into kafka/redis

    res.json({
        message: "WEBHOOK run successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Hooks Server is listening on port ${PORT}`);
});