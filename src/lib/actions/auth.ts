import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateMagicToken } from "../utils";
import { sendMagicEmail } from "../magic-mailer";

export async function registerUser(email: string, password: string) {
  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      throw new Error("This email is already part of the magic academy! 🪄");
    }

    const verificationToken = generateMagicToken();
    
    await db.insert(users).values({
      email,
      password,
      verificationToken,
      isVerified: false,
    });

    // Send verification email
    const verificationLink = `http://localhost:5175/verify?token=${verificationToken}`;
    await sendMagicEmail(email, "Welcome to the Magic Academy - Verify Your Email", verificationLink);

    return { success: true, needsVerification: true, email };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verifyEmail(token: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.verificationToken, token),
    });

    if (!user) {
      throw new Error("Invalid or expired magic token! 🌪️");
    }

    await db.update(users)
      .set({ isVerified: true, verificationToken: null })
      .where(eq(users.id, user.id));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, email), eq(users.password, password)),
    });

    if (!user) {
      throw new Error("Invalid email or password! Try again magic user! ✨");
    }

    if (!user.isVerified) {
      throw new Error("Your magic essence is not yet verified! Check your email! ✉️");
    }

    return { success: true, user: { email: user.email } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // For security, don't reveal if user exists.
      return { success: true }; 
    }

    const resetToken = generateMagicToken();
    await db.update(users)
      .set({ resetToken })
      .where(eq(users.id, user.id));

    const resetLink = `http://localhost:5175/reset-password?token=${resetToken}`;
    await sendMagicEmail(email, "Magic Academy - Reset Your Secret Password", resetLink);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.resetToken, token),
    });

    if (!user) {
      throw new Error("Invalid or expired reset spell! 🌪️");
    }

    await db.update(users)
      .set({ password: newPassword, resetToken: null })
      .where(eq(users.id, user.id));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
