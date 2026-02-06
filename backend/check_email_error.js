
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config({ path: "backend/.env" });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testSend() {
    console.log("Testing Resend Configuration...");
    console.log("API Key:", process.env.RESEND_API_KEY ? "Present" : "Missing");
    console.log("From:", process.env.EMAIL_FROM);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: "randomuser@example.com", // Try sending to an outsider
            subject: "Test Verification",
            html: "<p>If you get this, it works!</p>",
        });

        if (error) {
            console.error("\n❌ FAILED TO SEND:");
            console.error("Error Code:", error.name);
            console.error("Message:", error.message);

            if (error.message.includes("verify your domain")) {
                console.log("\n💡 DIAGNOSIS: Your Domain is NOT Verified yet. DNS propagation takes 15-60 mins.");
            } else if (error.message.includes("sandboxed")) {
                console.log("\n💡 DIAGNOSIS: Still in Sandbox Mode. You can only send to yourself.");
            }
        } else {
            console.log("\n✅ SUCCESS! Email ID:", data.id);
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

testSend();
