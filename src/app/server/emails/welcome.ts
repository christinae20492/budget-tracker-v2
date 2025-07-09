import { Resend } from "resend";

export const sendWelcomeEmail = async (to: string, username: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: "welcome@justabit.app",
      to,
      subject: "Welcome to Just A Bit!",
      html: `
        <h1>Nice to meet you, ${username}!</h1>
        <p>Welcome to Just A Bit! We're thrilled to have you join our community. Get ready to take control of your finances with ease. Our intuitive tools help you effortlessly track income, manage expenses with smart envelopes, and gain clear insights into your spending habits. Start your journey to financial peace of mind today!</p>
        <p>Get started by exploring your dashboard and organizing your budget efficiently. Create an envelope to get started adding expenses and incomes. If you have any questions, visit the 'Help' tab within the 'Account' page.</p>
      `,
    });
    console.log("Welcome email sent:", data);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
