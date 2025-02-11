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
            name: 'specs',
            title: 'Характеристики',
            type: 'object',
            fields: [
                { name: 'area', title: 'Площадь', type: 'string' },
                { name: 'cooling_power', title: 'Холодопроизводительность', type: 'string' },
                { name: 'management', title: 'Управление / хладагент', type: 'string' },
                { name: 'temperature_range', title: 'Диапазон рабочих температур', type: 'string' },
            ],
        }),
    ],
});
