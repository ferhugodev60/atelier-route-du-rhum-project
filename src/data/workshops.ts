export interface WorkshopDetail {
    title: string;
    desc: string;
    fullDesc: string;
    image: string;
    price: string;
    duration: string;
    included: string;
    availability?: string;
}

export const WORKSHOP_DETAILS: Record<string, WorkshopDetail> = {
    fruits: {
        title: "Niveau 1 : L'Atelier Fruits",
        price: "140€",
        duration: "2h30",
        included: "une bouteille d'1 litre de Rhum arrangé",
        desc: "Maitrise des acides de fruits",
        fullDesc: "Apprenez à travailler les fruits frais de saison pour créer une macération harmonieuse.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    },
    epices: {
        title: "Niveau 2 : L'Atelier Épices",
        price: "170€",
        duration: "3h",
        included: "l'épisothèque : une boîte de 10 flacons (gustatif, informatif et olfactif)",
        desc: "Le caractère et la structure de votre nectar.",
        fullDesc: "Plongez dans l'univers des épices rares pour donner une structure unique et boisée à votre rhum.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    },
    plantes: {
        title: "Niveau 3 : L'Atelier Plantes",
        price: "210€",
        duration: "4h",
        included: "la pharmatech : une boîte de 10 flacons (gustatif, informatif et olfactif)",
        desc: "L'exploration botanique et florale.",
        fullDesc: "Utilisez des herbes aromatiques et des plantes pour apporter des notes florales complexes à votre signature d'alchimiste.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    },
    mixologie: {
        title: "Niveau 4 : L'Atelier Mixologie",
        price: "420€",
        duration: "8h",
        included: "la conception de 6 recettes de 25 centilitres",
        availability: "Du Mardi au Jeudi de 10h à 20h (Repas de 2h inclus)",
        desc: "L'art ultime du service et du cocktail.",
        fullDesc: "Une immersion complète de 8 heures pour maîtriser les techniques de bar professionnelles et créer vos propres cocktails signatures.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    }
};

export const IMG_DISCOVERY = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop";