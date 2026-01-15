export interface WorkshopDetail {
    title: string;
    desc: string;
    fullDesc: string;
    image: string;
    price: string;
    duration: string;
    availability?: string;
}

export const WORKSHOP_DETAILS: Record<string, WorkshopDetail> = {
    fruits: {
        title: "Niveau 1 : L'Atelier Fruits",
        price: "140€",
        duration: "2h30",
        desc: "L'équilibre parfait entre sucre et puissance.",
        fullDesc: "Apprenez à travailler les fruits frais de saison pour créer une macération harmonieuse sous les conseils de Nabil Ziani.",
        image: "https://images.unsplash.com/photo-1613310023042-ad79320c00fc?q=80&w=1000&auto=format&fit=crop"
    },
    epices: {
        title: "Niveau 2 : L'Atelier Épices",
        price: "170€",
        duration: "3h00",
        desc: "Le caractère et la structure de votre nectar.",
        fullDesc: "Plongez dans l'univers des épices rares pour donner une structure unique et boisée à votre rhum.",
        image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=1000&auto=format&fit=crop"
    },
    plantes: {
        title: "Niveau 3 : L'Atelier Plantes",
        price: "210€",
        duration: "4h00",
        desc: "L'exploration botanique et florale.",
        fullDesc: "Utilisez des herbes aromatiques et des plantes pour apporter des notes florales complexes à votre signature d'alchimiste.",
        image: "https://images.unsplash.com/photo-1541250848049-b4f71413cc3f?q=80&w=1000&auto=format&fit=crop"
    },
    mixologie: {
        title: "Niveau 4 : L'Atelier Mixologie",
        price: "420€",
        duration: "8h00",
        availability: "Mardi au Jeudi (10h - 20h)",
        desc: "L'art ultime du service et du cocktail.",
        fullDesc: "Une immersion de 8 heures incluant 2h de pause repas pour maîtriser les techniques de bar professionnelles.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    }
};

export const IMG_DISCOVERY = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop";