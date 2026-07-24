import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { generateOtpTemplate } from "./template/otp-template";
import { generateNormalEmailTemplate } from "./template/normal-email-template";
import { info } from "console";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("❌ EMAIL_USER or EMAIL_PASS is missing in environment variables.");
}

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4, // force IPv4
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
        const mailData = {
            from: `"Atif" <${process.env.EMAIL_USER}>`,
            to,
            subject: "AutoChain",
            html,
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailData, (err: any, info: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });

        console.log("Email sent:");
    } catch (error) {
        console.error("Error while sending email:", error);
    }
}

export { sendEmail };
