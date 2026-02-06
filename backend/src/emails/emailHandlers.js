import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate, createVerificationEmailTemplate, createResetPasswordEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chatify!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};

export const sendVerificationEmail = async (email, otp) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Verify Your Email",
    html: createVerificationEmailTemplate(otp),
  });

  if (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }

  console.log("Verification Email sent successfully", data);
};

export const sendResetPasswordEmail = async (email, otp) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Reset Your Password",
    html: createResetPasswordEmailTemplate(otp),
  });

  if (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password email");
  }

  console.log("Reset Password Email sent successfully", data);
};
