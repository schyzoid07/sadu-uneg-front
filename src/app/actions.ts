"use server";

import { getSession } from "@/lib/session";

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;
    return { username: session.username };
}
