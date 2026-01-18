import shopImg from '../assets/images/shop.jpg';

export interface BottleSize {
    capacity: string; // '25 cl', '33 cl', etc.
    price: number;    // Prix spécifique à la taille
    stock: number;    // Quantité réelle en stock pour simulation
}

export interface Bottle {
    id: number;
    name: string;
    type: string;
    flavor: string;
    image: string;
    desc: string;
    availableSizes: BottleSize[];
}

export const BOTTLES: Bottle[] = [
    {
        id: 1,
        name: "Ananas & Vanille",
        type: "Rhum Arrangé",
        flavor: "Fruité",
        image: shopImg,
        desc: "Une macération solaire où la sucrosité de l'ananas Victoria rencontre la douceur de la vanille Bourbon.",
        availableSizes: [
            { capacity: '25 centilitres', price: 20, stock: 0 },
            { capacity: '50 centilitres', price: 39, stock: 0 },
            { capacity: '1 litre', price: 75, stock: 10 }
        ]
    },
    {
        id: 2,
        name: "Mangue & Passion",
        type: "Signature",
        flavor: "Épicé",
        image: shopImg,
        desc: "Un équilibre exotique intense, relevé par une pointe de poivre long pour une structure élégante.",
        availableSizes: [
            { capacity: '33 centilitres', price: 25, stock: 12 },
            { capacity: '70 centilitres', price: 65, stock: 8 }
        ]
    },
    {
        id: 3,
        name: "Vanille Bourbon",
        type: "Rhum Arrangé",
        flavor: "Suave",
        image: shopImg,
        desc: "La pureté d'un rhum agricole sublimé par une infusion lente de gousses de vanille de Madagascar.",
        availableSizes: [
            { capacity: '50 centilitres', price: 39, stock: 15 },
            { capacity: '70 centilitres', price: 65, stock: 10 },
            { capacity: '1 litre', price: 75, stock: 3 }
        ]
    }
];