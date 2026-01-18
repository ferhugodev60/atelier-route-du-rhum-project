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
        included: "Bouteille d'1 litre de Rhum arrangé",
        desc: "L'équilibre parfait entre sucre et puissance.",
        fullDesc: "Apprenez à travailler les fruits frais de saison pour créer une macération harmonieuse sous les conseils de Nabil Ziani.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    },
    epices: {
        title: "Niveau 2 : L'Atelier Épices",
        price: "170€",
        duration: "3h",
        included: "Epicothèque : Boîte de 10 flacons (gustatif, informatif et olfactif)",
        desc: "Le caractère et la structure de votre nectar.",
        fullDesc: "Plongez dans l'univers des épices rares pour donner une structure unique et boisée à votre rhum.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    },
    plantes: {
        title: "Niveau 3 : L'Atelier Plantes",
        price: "210€",
        duration: "4h",
        included: "Pharmatech (10 flacons gustatif, informatif et olfactif)",
        desc: "L'exploration botanique et florale.",
        fullDesc: "Utilisez des herbes aromatiques et des plantes pour apporter des notes florales complexes à votre signature d'alchimiste.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    },
    mixologie: {
        title: "Niveau 4 : L'Atelier Mixologie",
        price: "420€",
        duration: "8h",
        included: "Conception de 6 recettes de 25 centilitres",
        availability: "Du Mardi au Jeudi de 10h à 20h (Repas de 2h inclus)",
        desc: "L'art ultime du service et du cocktail.",
        fullDesc: "Une immersion complète de 8 heures pour maîtriser les techniques de bar professionnelles et créer vos propres cocktails signatures.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    }
};

export const IMG_DISCOVERY = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop";