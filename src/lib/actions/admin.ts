'use server';

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllUsers() {
  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      role: users.role,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    }).from(users);
    
    return { success: true, users: allUsers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId: number, newRole: string) {
  try {
    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId));
      
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addWizard(email: string, pass: string, role: string) {
  try {
    await db.insert(users).values({
      email,
      password: pass,
      role,
      isVerified: true, // Admin-added users are pre-verified
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
