import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
    profileSchema,
    Profile,
    ChangeEmailInput,
    ChangePasswordInput,
} from "@/schemas/user";

export type { Profile, ChangeEmailInput, ChangePasswordInput };

// --- Funciones de API ---

const fetchProfile = async (): Promise<Profile> => {
    const res: any = await api.get("users/me").json();
    const data = (res && typeof res === "object" && "data" in res) ? res.data : res;
    return profileSchema.parse(data);
};

const changeEmail = async (json: ChangeEmailInput): Promise<any> => {
    return await api.put("users/change-username", { json }).json();
};

const changePassword = async (json: ChangePasswordInput): Promise<any> => {
    return await api.put("users/change-password", { json }).json();
};

// --- Hooks de React Query ---

/** La cuenta con la que se inició sesión. El backend la resuelve desde el token. */
export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
    });
}

export function useChangeEmail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: changeEmail,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}

/**
 * El token no cambia al cambiar la contraseña (identifica por id y sigue vigente
 * las 24 horas), así que no hay nada de la caché que invalidar.
 */
export function useChangePassword() {
    return useMutation({
        mutationFn: changePassword,
    });
}
