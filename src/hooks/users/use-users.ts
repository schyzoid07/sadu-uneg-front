import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface ChangePasswordInput {
    oldPassword: string;
    newPassword: string;
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (data: ChangePasswordInput) => {
            const res = await api.put("users/change-password", { json: data }).json();
            return res;
        },
    });
}
