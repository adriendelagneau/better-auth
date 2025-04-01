"use server";

import { resend } from "@/lib/resend";


export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM environment variable is not set");
  }

  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [to.toLowerCase().trim()], // Resend expects an array
      subject: subject.trim(),
      text: text.trim(),
    });

    console.log("Resend response:", response); // Debugging: check actual response structure

    return {
      success: true,
      response, // Return the full response for debugging
    };
  } catch (error: unknown) {
    console.error("Error sending email:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send email. Please try again later.",
    };
  }
}
