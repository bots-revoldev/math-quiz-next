'use server';

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function registerUser(email: string, password: string) {
  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      throw new Error("This email is already part of the magic academy! 🪄");
    }

    await db.insert(users).values({
      email,
      password, // Note: In a real app, hash this! For a self-hosted light app, we'll stick to simple storage for now.
    });

    return { success: true, user: { email } };
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

    return { success: true, user: { email: user.email } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
