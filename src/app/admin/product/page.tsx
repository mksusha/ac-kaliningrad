// import { PrismaClient } from '@prisma/client'
//
// const prisma = new PrismaClient()
//
// type Product = {
//     id: number
//     sanityId?: string | null
//     title: string
//     prices?: any
// }
//
// export default async function ProductsPage() {
//     const products = await prisma.product.findMany()
//
//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Список продуктов</h1>
//             <ul className="space-y-2">
//                 {products.map((product: Product) => {
//                     let price = '—'
//                     if (product.prices) {
//                         try {
//                             const pricesObj = product.prices as any
//                             price = pricesObj.price ? `${pricesObj.price} ₽` : '—'
//                         } catch {
//                             price = '—'
//                         }
//                     }
//
//                     return (
//                         <li key={product.id} className="p-4 border rounded">
//                             <strong>{product.title}</strong> — {price}
//                             <br />
//                             <small>ID Sanity: {product.sanityId || 'нет'}</small>
//                         </li>
//                     )
//                 })}
//             </ul>
//         </div>
//     )
// }
