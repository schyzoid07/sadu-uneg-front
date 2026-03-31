"use client"
import { formSchema } from "@/schemas/login-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginAction } from "./actions"
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ProfileForm() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Formulario válido, enviando a actions.ts:", values);
        setIsLoading(true);
        setError(null);
        try {
            const result = await loginAction(values);
            if (result?.error) {
                setError(result.error);
            }
            console.log("Resultado del login:", result);
        } catch (err) {
            setError("Algo salio mal. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center py-10 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Errores de validación (actions.ts no se ejecutará):", errors))}
                        className="space-y-4"
                    >
                        <h1 className="text-2xl font-bold mb-6 text-center text-[#2f34a0]">Iniciar Sesión</h1>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="correo@ejemplo.com" {...field} disabled={isLoading} />
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
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                        </Button>

                        {/*<div className="text-center pt-2">
                            <Link href="/register" className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors">
                                ¿No tienes usuario? Regístrate aquí {'\u2192'}
                            </Link>
                        </div>*/}
                    </form>
                </Form>
            </div>
        </div>
    )
}
