import axios from "axios";
import { prisma } from "./lib/prisma";
import express from 'express';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const worker_api = process.env.WORKER_API;
const processor_api = process.env.PROCESSOR_API;

app.use(express.json());
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log(body);
    worker_api && await axios.get(worker_api);
    processor_api && await axios.get(processor_api);
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


    res.json({
        message: "WEBHOOK run successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Hooks Server is listening on port ${PORT}`);
});