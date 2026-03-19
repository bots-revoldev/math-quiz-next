'use client';

// This is a simulated mailer for development.
// It logs magic links to the terminal/console instead of sending a real email.

export function sendMagicEmail(to: string, subject: string, link: string) {
  console.log(`
  ✨ MAGIC MAIL SENT TO: ${to} ✨
  -----------------------------------
  Subject: ${subject}
  
  Please click the magical link below:
  ${link}
  
  (In a production app, this would be an actual email!)
  -----------------------------------
  `);
}
