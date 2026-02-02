import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

(async () => {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "test@example.com", // This will only work if verified domain or strictly 'onboarding@resend.dev' sending to verified email in free tier? 
            // Actually onboarding@resend.dev can only send to the email you signed up with in Resend free tier.
            // But let's try sending to a dummy email and see if it fails with "invalid api key" or "sending to unverified address".
            subject: "Test Email",
            html: "<p>It works!</p>",
        });

        if (error) {
            console.error("Resend Error:", error);
        } else {
            console.log("Email sent successfully:", data);
        }
    } catch (err) {
        console.error("Script Error:", err);
    }
})();
