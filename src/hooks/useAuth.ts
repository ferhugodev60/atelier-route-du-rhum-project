import { useActionState } from 'react';

// Simulation d'une fonction de connexion (Alchimie 2026)
async function loginAction(_prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    // Simulation d'un délai réseau
    await new Promise((res) => setTimeout(res, 1000));

    if (email === "admin@rhum.com" && password === "secret") {
        return { success: true, message: "Entrée autorisée dans l'Antre." };
    }

    return { success: false, error: "Grimoire ou Identifiant invalide." };
}

export function useLogin() {
    // useActionState gère automatiquement l'état "isPending" (chargement)
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return { state, formAction, isPending };
}