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
    slug: string;
    management?: string;
    refrigerant?: string;
    areaOptions?: number[]; // Теперь у кондиционеров есть возможные площади
}
