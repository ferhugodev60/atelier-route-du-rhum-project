export interface Testimonial {
    id: number;
    author: string;
    rating: number;
    text: string;
    date: string;
}

export const REVIEWS: Testimonial[] = [
    {
        id: 1,
        author: "Alexane B.",
        rating: 5,
        text: "Un très bon moment de découverte ! Atelier decouverte animé par Nabil, un passionné qui nous fait découvrir et comprendre les bases du rhum arrangé avec beaucoup de pédagogie.",
        date: "Septembre 2025"
    },
    {
        id: 2,
        author: "Nicolas B.",
        rating: 5,
        text: "Nous avons passé un agréable moment d’échange et d’apprentissage. Expérience très enrichissante accompagné du maître en la matière Nabil. Vivement le niveau 2 !",
        date: "Janvier 2026"
    },
    {
        id: 3,
        author: "Maxime K.",
        rating: 5,
        text: "Atelier très enrichissant et patron super agréable. Nabil est un vrai passionné, et ça se ressent. Superbe après-midi passée.",
        date: "Septembre 2025"
    }
];