import { ZapCreateSchema } from "@repo/zod-schemas";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import prisma from "../lib/prisma";
import { ApiResponse } from "../utils/ApiResponse";

const createNewZap = async (req: Request, res: Response) => {
    try {
        const id = req.id;
        const body = req.body;
        const parsedData = ZapCreateSchema.safeParse(body);

        if (!parsedData.success) {
            throw new ApiError(411, "Incorrect Inputs");
        }

        const zap = await prisma.zap.create({
            data: {
                userId: id,
                trigger: {
                    create: {
                        metadata: parsedData.data.triggerMetadata,
                        triggerId: parsedData.data.availableTriggerId
                    }
                },
                action: {
                    create: parsedData.data.actions.map((action, index) => ({
                        actionId: action.availableActionId,
                        sortingOrder: index,
                        metadata: action.actionMetadata
                    }))
                }
            }
        });

        if (!zap.id) {
            throw new ApiError(500, "Zap creation failed");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Zap created successfully!"));
    } catch (error: any) {
        console.log("Error Occurred = ", error);
        return res.status(error.statusCode || 500).json({
            error: true,
            statusCode: error.statusCode,
            success: false,
            message: error.message,
        });
    }
};

const listAllZaps = async (req: Request, res: Response) => {
    try {
        const id = req.id;
        const zaps = await prisma.zap.findMany({
            where: {
                userId: id,
            },
            include: {
                action: {
                    include: {
                        type: true,
                    },
                },
                trigger: {
                    include: {
                        type: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!zaps) {
            throw new ApiError(404, "No Zaps found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, zaps, "Zaps found successfully"));
    } catch (error: any) {
        console.log("Error Occurred = ", error);
        return res.status(error.statusCode || 500).json({
            error: true,
            statusCode: error.statusCode,
            success: false,
            message: error.message,
        });
    }
};

const getSingleZap = async (req: Request, res: Response) => {
    try {
        const id = req.id;
        const zapId = req.params.zapId;

        if (!zapId) {
            throw new ApiError(404, "All fields are necessary");
        }

        const zap = await prisma.zap.findFirst({
            where: {
                id: zapId,
                userId: id,
            },
            include: {
                action: {
                    include: {
                        type: true,
                    },
                },
                trigger: {
                    include: {
                        type: true,
                    },
                },
            },
        });

        if (!zap) {
            throw new ApiError(404, "No Zaps found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, zap, "Zap found successfully"));
    } catch (error: any) {
        console.log("Error Occurred = ", error);
        return res.status(error.statusCode || 500).json({
            error: true,
            statusCode: error.statusCode,
            success: false,
            message: error.message,
        });
    }
};

const deleteSingleZap = async (req: Request, res: Response) => {
    try {
        const zapId = req.params.zapId;
        if (!zapId) {
            throw new ApiError(404, "No Zaps found");
        }

        const zap = await prisma.$transaction(async (tx) => {
            await tx.trigger.delete({
                where: {
                    zapId: zapId,
                },
            });

            await tx.action.deleteMany({
                where: {
                    zapId: zapId,
                },
            });

            const zapRuns = await tx.zapRun.findMany({
                where: {
                    zapId: zapId,
                },
            });
            const zapRunIds = zapRuns.map((zapRun) => zapRun.id);

            await tx.zapRun.deleteMany({
                where: {
                    zapId: zapId,
                },
            });

            await tx.zapRunOutBox.deleteMany({
                where: {
                    zapRunId: {
                        in: zapRunIds,
                    },
                },
            });

            await tx.zap.delete({
                where: {
                    id: zapId,
                },
            });
        });

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Zap deleted successfully"));
    } catch (error: any) {
        console.log("Error Occurred = ", error);
        return res.status(error.statusCode || 500).json({
            error: true,
            statusCode: error.statusCode,
            success: false,
            message: error.message,
        });
    }
};

export { createNewZap, listAllZaps, getSingleZap, deleteSingleZap };