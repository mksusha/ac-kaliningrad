import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import service from './service'
import work from "@/sanity/schemaTypes/work";
import location from "@/sanity/schemaTypes/location";
import request from "@/sanity/schemaTypes/request";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, service, work,location, request],
}
