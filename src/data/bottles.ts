import shopImg from '../assets/images/shop.jpg';

export interface Bottle {
    id: number;
    name: string;
    price: number;
    type: string;
    flavor: string;
    image: string;
    stock: string;
    desc: string;
}

export const BOTTLES: Bottle[] = [
    { id: 1, name: "Ananas & Vanille", price: 45, type: "Rhum Arrangé", flavor: "Fruité", image: shopImg, stock: "Limité", desc: "Une macération solaire où la sucrosité de l'ananas Victoria rencontre la douceur de la vanille Bourbon." },
    { id: 2, name: "Mangue & Passion", price: 48, type: "Signature", flavor: "Épicé", image: shopImg, stock: "Disponible", desc: "Un équilibre exotique intense, relevé par une pointe de poivre long pour une structure élégante." },
    { id: 3, name: "Vanille Bourbon", price: 42, type: "Rhum Arrangé", flavor: "Suave", image: shopImg, stock: "Disponible", desc: "La pureté d'un rhum agricole sublimé par une infusion lente de gousses de vanille de Madagascar." },
    { id: 4, name: "Gingembre", price: 55, type: "Plantes", flavor: "Floral", image: shopImg, stock: "Nouveauté", desc: "Une attaque vive et citronnée suivie par la chaleur persistante d'un gingembre frais de premier choix." },
    { id: 5, name: "Bois Noir", price: 52, type: "Signature", flavor: "Boisé", image: shopImg, stock: "Disponible", desc: "Une création complexe aux notes de chêne brûlé, de cacao amer et de cuir, pour les amateurs de caractère." },
];