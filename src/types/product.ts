export interface AirConditioner {
    _id: string;
    title: string;
    brand: string;
    category: string;
    imageUrl: string;
    images: { url: string }[];
    description: string;
    specs: {
        cooling_power: string;
    };
    prices: string[];
    slug: string;
    management?: string;
    refrigerant?: string;
    areaOptions?: number[];
}
