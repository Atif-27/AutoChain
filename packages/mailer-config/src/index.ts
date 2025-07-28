import { Resend } from 'resend';
import { generateOtpTemplate } from "./template/otp-template";
import dotenv from "dotenv";
import { generateNormalEmailTemplate } from "./template/normal-email-template";

dotenv.config();
if (!process.env.RESEND_API_KEY) {
    throw new Error("❌ RESEND_API_KEY is missing in environment variables.");
}
const resend = new Resend(process.env.RESEND_API_KEY ?? "");

async function sendEmail(
    to: string,
    body: string,
    type: "otp" | "normal",
) {
    try {
        const data = await resend.emails.send({
            from: `Atif <onboarding@resend.dev>`,
            to: [to],
            subject: "Zapier",
            html:
                type === "otp"
                    ? generateOtpTemplate(body)
                    : generateNormalEmailTemplate(body),
        });

        console.log("data from resend email = ", data);
    } catch (error) {
        // return console.error({ error });
        console.log("Error while sending email = ", error);
    }
}

export { sendEmail };
