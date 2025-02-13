import { defineType, defineField } from 'sanity';

export const product = defineType({
    name: 'product',
    title: 'Кондиционер',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Название',
            type: 'string',
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
        defineField({
            name: 'specs',
            title: 'Характеристики',
            type: 'object',
            fields: [
                { name: 'cooling_power', title: 'Охлаждение (кВт)', type: 'string' },
                { name: 'heating_power', title: 'Нагрев (кВт)', type: 'string' },
                { name: 'power_supply', title: 'Электропитание (Ф / В / Гц)', type: 'string' },
                { name: 'energy_efficiency', title: 'Энергоэффективность (EER)', type: 'string' },
                { name: 'heating_efficiency', title: 'Эффективность нагрева (COP)', type: 'string' },
                { name: 'noise_level', title: 'Уровень шума (дБА)', type: 'string' },
                { name: 'dimensions_inner', title: 'Размеры внутреннего блока (мм)', type: 'string' },
                { name: 'dimensions_outer', title: 'Размеры наружного блока (мм)', type: 'string' },
                { name: 'weight_inner', title: 'Вес внутреннего блока (кг)', type: 'string' },
                { name: 'weight_outer', title: 'Вес наружного блока (кг)', type: 'string' },
                { name: 'refrigerant_type', title: 'Тип хладагента', type: 'string' },
                { name: 'refrigerant_charge', title: 'Заправка хладагента (кг)', type: 'string' },
                { name: 'pipe_liquid', title: 'Диаметр трубки жидкости (мм)', type: 'string' },
                { name: 'pipe_gas', title: 'Диаметр трубки газа (мм)', type: 'string' },
                { name: 'pipe_length', title: 'Длина трубопровода (м)', type: 'string' },
                { name: 'pipe_difference', title: 'Перепад высот (м)', type: 'string' },
                { name: 'working_temp_cooling', title: 'Диапазон температур охлаждения (°C)', type: 'string' },
                { name: 'working_temp_heating', title: 'Диапазон температур нагрева (°C)', type: 'string' },
                { name: 'lifetime', title: 'Срок эксплуатации', type: 'string' },
                { name: 'manufacturer_country', title: 'Страна производства', type: 'string' },
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
            of: [{
                type: 'object',
                fields: [
                    { name: 'name', title: 'Название', type: 'string' },
                    { name: 'url', title: 'Ссылка', type: 'url' },
                ],
            }],
        }),
        defineField({
            name: 'documents',
            title: 'Документы',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'title', title: 'Название документа', type: 'string' },
                    { name: 'url', title: 'Ссылка на документ', type: 'url' },
                ],
            }],
        }),
    ],
});
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
}
