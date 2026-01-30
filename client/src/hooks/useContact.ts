import { useActionState } from 'react';

async function contactAction(_prevState: any, _formData: FormData) {
    // Simulation d'envoi (ex: API Resend ou EmailJS)
    await new Promise((res) => setTimeout(res, 1500));

    return {
        success: true,
        message: "Votre message a bien été envoyé !"
    };
}

export function useContactForm() {
    const [state, formAction, isPending] = useActionState(contactAction, null);
    return { state, formAction, isPending };
}