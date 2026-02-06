export interface Workshop {
    id: string;
    level: number;
    title: string;
    description: string;
    image: string;
    price: number;
    format: string;
    availability?: string;
    quote?: string;
    color?: string;
}