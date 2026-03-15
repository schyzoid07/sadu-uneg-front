"use server"

import { formSchema } from "@/schemas/login-form"
import { createSession } from "@/lib/session"
import { z } from "zod"
import ky from "ky"
import { redirect } from "next/navigation"

export async function loginAction(values: z.infer<typeof formSchema>) {
    const validatedFields = formSchema.safeParse(values);


    if (!validatedFields.success) {
        return {
            error: "Invalid fields",
        };
    }
    try {
        // Backend responds with { "message": "...", "data": "token-string" }
        const res = await ky.post("http://localhost:8080/users/login", {
            json: values,
        }).json() as { data: string };

        if (!res.data) {
            return { error: "Authentication failed: No token received" };
        }
        await createSession(res.data);
    } catch (error) {
        console.error("Login error:", error);
        return { error: "Something went wrong. Please check your credentials." };
    }

    // 4. Redirect to dashboard
    redirect("/atletas");
}
