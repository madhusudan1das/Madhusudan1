import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendTestEmail = async () => {
    try {
        console.log("Attempting to send email with Key:", process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "delivered@resend.dev", // Resend test email
            subject: "Test Email",
            html: "<p>It works!</p>",
        });

        if (error) {
            console.error("Resend Error:", error);
        } else {
            console.log("Resend Success:", data);
        }
    } catch (err) {
        console.error("Script Error:", err);
    }
};

sendTestEmail();
