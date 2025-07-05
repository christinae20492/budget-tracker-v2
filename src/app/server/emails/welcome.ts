import { Resend } from "resend";

export const sendWelcomeEmail = async (to: string, username: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: "welcome@justabit.app",
      to,
      subject: "Welcome to Justabit!",
      html: `
        <h1>Welcome, ${username}!</h1>
        <p>Thanks for joining Just A Bit. We're excited to have you on board 🚀.</p>
        <p>Get started by exploring your dashboard and organizing your budget efficiently.</p>
      `,
    });
    console.log("Welcome email sent:", data);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
