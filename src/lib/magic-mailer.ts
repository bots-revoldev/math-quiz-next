import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendMagicEmail(to: string, subject: string, link: string) {
  if (resend) {
    try {
      await resend.emails.send({
        from: 'Magic Academy <academy@resend.dev>', // Note: Update this after domain verification!
        to: [to],
        subject: subject,
        html: `
          <div style="font-family: sans-serif; padding: 20px; text-align: center; background: #fafafa;">
            <h1 style="color: #9333ea;">✨ Magic Academy ✨</h1>
            <p style="font-size: 18px;">A magical scroll has arrived for you!</p>
            <a href="${link}" style="display: inline-block; padding: 12px 24px; background: #9333ea; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px;">
              Open My Magical Scroll
            </a>
            <p style="color: #666; margin-top: 20px; font-size: 14px;">If you didn't request this, simply ignore it.</p>
          </div>
        `
      });
      return;
    } catch (error) {
      console.error("Failed to send real magic email:", error);
    }
  }

  // Fallback to console simulation if Resend is not configured or fails
  console.log(`
  ✨ MAGIC MAIL SENT TO: ${to} ✨ (Simulation)
  -----------------------------------
  Subject: ${subject}
  
  Please click the magical link below:
  ${link}
  -----------------------------------
  `);
}
