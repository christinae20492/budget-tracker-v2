import React from "react";
import { Resend } from "resend";
import WelcomeEmail from "./reactwelcome";

export const sendWelcomeEmail = async (email: string, username: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
        from: `<no-reply@justabit.app>`,
        to: email,
        subject: `${username}, welcome to Just A Bit`,
        react: React.createElement(WelcomeEmail, {
          username: username,
          loginUrl: 'justabit.app/auth/login',
          appName: 'Just A Bit'
        }),
      });
    console.log("Welcome email sent:", data);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
