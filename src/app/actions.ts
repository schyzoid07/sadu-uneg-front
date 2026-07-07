"use server";

import { getSession } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;
    return { username: session.username };
}

export async function uploadDisciplineImage(name: string, file: File) {
    const session = await getSession();
    if (!session) return { error: "No autenticado" };

    const normalizedName = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");

    const ext = file.name.split('.').pop() || "webp";
    const fileName = `${normalizedName}.${ext}`;
    const dirPath = path.join(process.cwd(), "public", "images", "disciplines");
    const filePath = path.join(dirPath, fileName);

    await mkdir(dirPath, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return { success: true, fileName };
}
