import { defineType, defineField } from 'sanity';

export const product = defineType({
    name: 'product',
    title: 'Кондиционер',
    type: 'document',
    fields: [
        // Основные поля
        defineField({
            name: 'title',
            title: 'Название',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 200,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'brand',
            title: 'Бренд',
            type: 'string',
            options: {
                list: [
                    { title: 'AIRWAVE', value: 'AIRWAVE' },
                    { title: 'Aurum', value: 'Aurum' },
                    { title: 'Axioma', value: 'Axioma' },
                    { title: 'BOSCH', value: 'BOSCH' },
                    { title: 'Daichi', value: 'Daichi' },
                    { title: 'DAICHIxMES', value: 'DAICHIxMES' },
                    { title: 'DAICHIxMTC', value: 'DAICHIxMTC' },
                    { title: 'Daikin', value: 'Daikin' },
                    { title: 'Kentatsu', value: 'Kentatsu' },
                    { title: 'Midea', value: 'Midea' },
                    { title: 'Primera', value: 'Primera' },
                ],
            },
        }),
        defineField({
            name: 'category',
            title: 'Категория',
            type: 'string',
            options: {
                list: [
                    { title: 'Настенные кондиционеры', value: 'wall' },
                    { title: 'Облачные кондиционеры', value: 'cloud' },
                    { title: 'Мобильные кондиционеры', value: 'mobile' },
                    { title: 'Оконные кондиционеры', value: 'window' },
                ],
            },
        }),
        defineField({
            name: 'description',
            title: 'Описание',
            type: 'text',
        }),
        defineField({
            name: 'images',
            title: 'Изображения',
            type: 'array',
            of: [{ type: 'image' }],
        }),
        defineField({
            name: 'models',
            title: 'Модели',
            type: 'array',
            of: [{ type: 'string' }],
        }),

        // Характеристики — все поля в виде массивов строк
        defineField({
            name: 'specs',
            title: 'Характеристики',
            type: 'object',
            fields: [
                defineField({
                    name: 'cooling_power',
                    title: 'Охлаждение (кВт)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'heating_power',
                    title: 'Нагрев (кВт)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'power_supply',
                    title: 'Электропитание (Ф / В / Гц)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'energy_efficiency',
                    title: 'Энергоэффективность (EER)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'heating_efficiency',
                    title: 'Эффективность нагрева (COP)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'noise_level',
                    title: 'Уровень шума (дБА)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'dimensions_inner',
                    title: 'Размеры внутреннего блока (мм)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'dimensions_outer',
                    title: 'Размеры наружного блока (мм)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'weight_inner',
                    title: 'Вес внутреннего блока (кг)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'weight_outer',
                    title: 'Вес наружного блока (кг)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'refrigerant_type',
                    title: 'Тип хладагента',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'refrigerant_charge',
                    title: 'Заправка хладагента (кг)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'pipe_liquid',
                    title: 'Диаметр трубки жидкости (мм)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'pipe_gas',
                    title: 'Диаметр трубки газа (мм)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'pipe_length',
                    title: 'Длина трубопровода (м)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'pipe_difference',
                    title: 'Перепад высот (м)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'working_temp_cooling',
                    title: 'Диапазон температур охлаждения (°C)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'working_temp_heating',
                    title: 'Диапазон температур нагрева (°C)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'lifetime',
                    title: 'Срок эксплуатации',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({
                    name: 'manufacturer_country',
                    title: 'Страна производства',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
            ],
        }),

        defineField({
            name: 'prices',
            title: 'Цены',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'buy_links',
            title: 'Ссылки на покупку',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Название',
                            type: 'string',
                        }),
                        defineField({
                            name: 'url',
                            title: 'Ссылка',
                            type: 'url',
                        }),
                    ],
                },
            ],
        }),
        defineField({
            name: 'documents',
            title: 'Документы',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Название документа',
                            type: 'string',
                        }),
                        defineField({
                            name: 'url',
                            title: 'Ссылка на документ',
                            type: 'url',
                        }),
                    ],
                },
            ],
        }),
        defineField({
            name: 'areaOptions',
            title: 'Площадь помещения, м²',
            type: 'array',
            of: [{ type: 'number' }],
            description: 'Доступные варианты площади помещения, например: [25, 35, 50, 60]',
        }),
        defineField({
            name: 'management',
            title: 'Управление',
            type: 'string',
            description: 'Режим управления',
            options: {
                list: [
                    { title: 'Full DC Inverter', value: 'Full DC Inverter' },
                    { title: 'Inverter', value: 'Inverter' },
                    { title: 'On/Off', value: 'On/Off' },
                ],
            },
        }),
        defineField({
            name: 'refrigerant',
            title: 'Хладагент',
            type: 'string',
            description: 'Тип хладагента',
            options: {
                list: [
                    { title: 'R290', value: 'R290' },
                    { title: 'R32', value: 'R32' },
                    { title: 'R410A', value: 'R410A' },
                ],
            },
        }),
        defineField({
            name: 'range',
            title: 'Диапазон',
            type: 'string',
            description: 'Диапазон работы (если применимо)',
        }),
        // Новые поля:
        defineField({
            name: 'cooling_capacity',
            title: 'Холодопроизводительность, кВт',
            type: 'string',
            description: 'Значения холодопроизводительности, например: "2.05; 2.64; 3.52; 5.28; 7.03"',
        }),
        // defineField({
        //     name: 'statsLogo',
        //     title: 'Логотип статистики',
        //     type: 'image',
        //     options: { hotspot: true },
        // }),
        defineField({
            name: 'manufacturer',
            title: 'Производитель',
            type: 'object',
            fields: [
                defineField({
                    name: 'logo',
                    title: 'Логотип производителя',
                    type: 'image',
                    options: { hotspot: true },
                }),
                defineField({
                    name: 'link',
                    title: 'Ссылка на производителя',
                    type: 'url',
                }),
                defineField({
                    name: 'desc',
                    title: 'Описание производителя',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'dealer',
            title: 'Дилер',
            type: 'object',
            fields: [
                defineField({
                    name: 'link',
                    title: 'Ссылка на дилера',
                    type: 'url',
                }),
                defineField({
                    name: 'desc',
                    title: 'Описание дилера',
                    type: 'string',
                }),
            ],
        }),
    ],
});

// Пример интерфейса для TypeScript (при необходимости)
export interface AirConditioner {
    _id: string;
    title: string;
    slug?: {
        _type: 'slug';
        current: string;
    };
    brand: string;
    category: string;
    description: string;
    // Если вы генерируете URL для изображений, можно хранить их как строки
    images: string[];
    models: string[];
    specs: {
        cooling_power: string[];
        heating_power: string[];
        power_supply: string[];
        energy_efficiency: string[];
        heating_efficiency: string[];
        noise_level: string[];
        dimensions_inner: string[];
        dimensions_outer: string[];
        weight_inner: string[];
        weight_outer: string[];
        refrigerant_type: string[];
        refrigerant_charge: string[];
        pipe_liquid: string[];
        pipe_gas: string[];
        pipe_length: string[];
        pipe_difference: string[];
        working_temp_cooling: string[];
        working_temp_heating: string[];
        lifetime: string[];
        manufacturer_country: string[];
    };
    prices: string[];
    buy_links: {
        name: string;
        url: string;
    }[];
    documents: {
        title: string;
        url: string;
    }[];
    areaOptions: number[];
    management: string;
    refrigerant: string;
    range: string;
    // Новые поля:
    cooling_capacity: string; // Холодопроизводительность, кВт (строка, например: "2.05; 2.64; 3.52; 5.28; 7.03")
    statsLogo: string;        // URL логотипа статистики
    manufacturer: {
        logo: string;  // URL логотипа производителя
        link: string;
        desc: string;
    };
    dealer: {
        link: string;
        desc: string;
    };
}
