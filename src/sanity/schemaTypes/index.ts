import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product' // Добавляем нашу схему
import service from './service'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, service], // Добавляем `product` в список схем
}
