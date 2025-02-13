import { createClient } from 'next-sanity';
import { AirConditioner } from '@/types/product';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2023-01-01',
    useCdn: true,
});

export async function getAirConditioners(): Promise<AirConditioner[]> {
    return client.fetch(`*[_type == "product"]{
    _id,
    title,
    brand,
    category,
    "imageUrl": images[0].asset->url,
    description,
    specs,
    prices
  }`);
}
