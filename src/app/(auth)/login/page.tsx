"use client"
import { formSchema } from "@/schemas/login-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginAction } from "./actions"
import { useState } from "react"

export default function ProfileForm() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const result = await loginAction(values);
            if (result?.error) {
                setError(result.error);
            }
            console.debug(result);
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center py-10 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-100 p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <h1 className="text-2xl font-bold mb-6 text-center text-[#2f34a0]">Iniciar Sesión</h1>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="correo@ejemplo.com" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                        <Button type="submit" className="w-full bg-[#2f34a0] hover:bg-[#242885]" disabled={isLoading}>
                            {isLoading ? "Cargando..." : "Entrar"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
