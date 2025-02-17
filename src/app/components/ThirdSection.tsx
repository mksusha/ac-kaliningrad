// 'use client'
// import { useEffect, useState } from "react";
// import client, { urlFor } from "@/sanity/lib/sanityImage"; // Путь может отличаться
//
// interface Category {
//     title: string;
//     value: string;
//     images: any[];
//     count: number;
// }
//
// const Home = () => {
//     const [categories, setCategories] = useState<Category[]>([]);
//
//     useEffect(() => {
//         client
//             .fetch<Category[]>(`*[_type == "category"]{
//                 title, value, images, "count": count(products)
//             }`)
//             .then((data) => {
//                 console.log("Полученные категории:", data);
//                 setCategories(data);
//             })
//             .catch(console.error);
//     }, []);
//
//     return (
//         <main className="bg text-[#333333] py-12">
//             <div className="mx-auto px-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div>
//                         <h1 className="text-3xl md:text-4xl font-bold uppercase leading-snug tracking-[0.05em]">
//                             ОБЕСПЕЧИВАЕМ <span className="bg-[#C7E07A] text-black px-1 py-1 rounded-md">УЮТ</span>
//                             <br /> В ВАШЕМ ДОМЕ И ОФИСЕ
//                         </h1>
//                     </div>
//                     <div>
//                         <p className="text-base md:text-lg leading-relaxed">
//                             «Кондиционер-Калининград.рф» — эксперт в продаже, установке и обслуживании
//                             кондиционеров. Мы помогаем создать идеальный микроклимат в вашем помещении.
//                         </p>
//                     </div>
//                 </div>
//
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
//                     {categories.length > 0 && (
//                         <div className="md:col-span-2 relative border border-[#333333] rounded-3xl overflow-hidden">
//                             <img
//                                 src={categories[0].images?.[0] ? urlFor(categories[0].images[0]) : "/fallback.jpg"}
//                                 alt={categories[0].title}
//                                 className="w-auto h-full object-contain"
//                             />
//                             <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md">
//                                 {categories[0].title} ({categories[0].count})
//                             </div>
//                         </div>
//                     )}
//                     {categories.slice(1, 4).map((category, index) => (
//                         <div key={index} className="relative border border-[#333333] rounded-3xl overflow-hidden">
//                             <img
//                                 src={category.images?.[0] ? urlFor(category.images[0]) : "/fallback.jpg"}
//                                 alt={category.title}
//                                 className="w-auto h-full object-contain"
//                             />
//                             <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md">
//                                 {category.title} ({category.count})
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </main>
//     );
// };
//
// export default Home;