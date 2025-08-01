import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const fetchAvailableTriggers = async (req: Request, res: Response) => {
    try {
        const availableTriggers = await prisma.availableTriggers.findMany({});

        if (!availableTriggers) {
            throw new ApiError(400, "No Available Triggers found");
        }

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    availableTriggers,
                    "Available Triggers fetched successfully",
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

export { fetchAvailableTriggers };