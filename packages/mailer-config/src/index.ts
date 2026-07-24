import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateOtpTemplate } from "./template/otp-template";
import { generateNormalEmailTemplate } from "./template/normal-email-template";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
        " EMAIL_USER or EMAIL_PASS is missing in environment variables."
    );
}

async function sendEmail(
    to: string,
    body: string,
    type: "otp" | "normal"
) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const html =
            type === "otp"
                ? generateOtpTemplate(body)
                : generateNormalEmailTemplate(body);

        const mailData = {
            from: `"Atif" <${process.env.EMAIL_USER}>`,
            to,
            subject: "AutoChain",
            html,
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailData, (err: any, info: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });

        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error while sending email:", error);
        throw error;
    }
}

export { sendEmail };