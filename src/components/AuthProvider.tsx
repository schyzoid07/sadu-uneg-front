// src/components/auth-provider.tsx
"use client";

import { createContext, useContext } from "react";
import { Session } from "@/schemas/auth";

interface AuthContextType {
    session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
});

export function AuthProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session | null;
}) {
    return (
        <AuthContext.Provider value={{ session }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
