export interface AirConditioner {
    _id: string;
    title: string;
    brand: string;
    category: string;
    imageUrl: string;
    description: string;
    specs: {
        cooling_power: string;
    };
    prices: string[];
    slug: string; // добавляем slug
    management?: string; // опциональное свойство для режима управления
    refrigerant?: string; // опциональное свойство для типа хладагента
}
