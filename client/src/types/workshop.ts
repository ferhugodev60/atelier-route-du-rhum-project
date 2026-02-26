export interface Workshop {
    id: string;
    level: number;
    type: 'PARTICULIER' | 'ENTREPRISE';
    title: string;
    description: string;
    image: string;
    price: number;
    priceInstitutional: number;
    format: string;
    availability?: string;
    quote?: string;
    color?: string;
}