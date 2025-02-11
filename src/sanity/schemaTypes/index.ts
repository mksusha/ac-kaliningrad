import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product' // Добавляем нашу схему

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product], // Добавляем `product` в список схем
}
