import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const fetchAvailableActions = async (req: Request, res: Response) => {
    try {
        const availableActions = await prisma.availableActions.findMany({});

        if (!availableActions) {
            throw new ApiError(404, "No Available Actions found");
        }

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    availableActions,
                    "Available Actions fetched successfully",
                ),
            );
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

export { fetchAvailableActions };