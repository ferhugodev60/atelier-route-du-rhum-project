export interface ProductVolume {
    id: string;
    size: number;
    unit: string;
    price: number;
    stock: number;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    categoryId: string;
    category: Category;
    volumes: ProductVolume[];
}