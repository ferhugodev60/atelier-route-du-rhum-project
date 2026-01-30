import shopImg from '../assets/images/shop.jpg';

export const CAT_FRUITE = "Fruité";
export const CAT_VRAC = "Vrac";
export const CAT_DAME_JEANNE = "Dame-Jeanne";

export interface BottleSize {
    capacity: string;
    price: number;
    stock: number;
}

export interface Bottle {
    id: number;
    name: string;
    category: typeof CAT_FRUITE | typeof CAT_VRAC | typeof CAT_DAME_JEANNE;
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
        category: CAT_FRUITE,
        type: "Rhum Arrangé",
        flavor: "Fruité",
        image: shopImg,
        desc: "Une macération solaire rempotable à l'infini. Gardez les fruits et complétez avec votre rhum blanc.",
        availableSizes: [
            { capacity: '25 centilitres', price: 20, stock: 10 },
            { capacity: '50 centilitres', price: 39, stock: 5 },
            { capacity: '1 litre', price: 75, stock: 10 }
        ]
    },
    {
        id: 2,
        name: "Mangue & Passion",
        category: CAT_VRAC,
        type: "Collection Vrac",
        flavor: "Épicé",
        image: shopImg,
        desc: "Format Vrac : une infusion intense sans fruits, prête pour une dégustation immédiate.",
        availableSizes: [
            { capacity: '33 centilitres', price: 25, stock: 12 },
            { capacity: '70 centilitres', price: 65, stock: 8 }
        ]
    },
    {
        id: 3,
        name: "Location Dame-Jeanne",
        category: CAT_DAME_JEANNE,
        type: "Prestige",
        flavor: "Signature",
        image: shopImg,
        desc: "Location de Dame-Jeanne pour vos événements. Service de mise à disposition et reprise inclus.",
        availableSizes: [
            { capacity: '3 litres', price: 150, stock: 1 },
            { capacity: '6 litres', price: 300, stock: 1 },
        ]
    }
];