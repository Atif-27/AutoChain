import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateOtpTemplate } from "./template/otp-template";
import { generateNormalEmailTemplate } from "./template/normal-email-template";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("❌ EMAIL_USER or EMAIL_PASS is missing in environment variables.");
}

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // or 'hotmail', 'yahoo', etc., depending on your email
    auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your app password
    },
});

async function sendEmail(
    to: string,
    body: string,
    type: "otp" | "normal",
) {
    try {
        const html =
            type === "otp"
                ? generateOtpTemplate(body)
                : generateNormalEmailTemplate(body);

        const info = await transporter.sendMail({
            from: `"Atif" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Zapier",
            html,
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error while sending email:", error);
    }
}

export { sendEmail };
