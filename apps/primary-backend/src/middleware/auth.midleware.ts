import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from "@repo/http-status";
import prisma from "../lib/prisma";
import { tokenType, tokenVerifier } from "../services/tokenVerifierService";
import { ApiError } from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken || accessToken?.startsWith("Bearer")) {
            throw new ApiError(
                HTTP_STATUS_CODES.ACCESS_TOKEN_NOT_FOUND,
                HTTP_STATUS_MESSAGES.ACCESS_TOKEN_NOT_FOUND,
            );
        }

        const decodedToken = tokenVerifier(accessToken, tokenType.AccessToken);

        const user = await prisma.user.findFirst({
            where: {
                id: decodedToken?.id,
            },
        });

        if (!user) {
            throw new ApiError(
                HTTP_STATUS_CODES.INVALID_ACCESS_TOKEN,
                HTTP_STATUS_MESSAGES.INVALID_ACCESS_TOKEN,
            );
        }

        // Attaching id field
        (req as Request & { id?: string; }).id = decodedToken?.id;

        next();
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