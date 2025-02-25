// /schemas/service.ts
import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'service',
    title: 'Услуга',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Название услуги',
            type: 'string',
            description: 'Например, "Монтаж одного кондиционера"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Описание услуги',
            type: 'text',
            description: 'Перечень работ и другая подробная информация',
            rows: 4,
        }),

        defineField({
            name: 'price',
            title: 'Цена',
            type: 'number',
            description: 'Начальная цена (например, 6000)',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'priceLabel',
            title: 'Метка цены',
            type: 'string',
            description: 'Текст перед ценой (по умолчанию "От")',
            initialValue: 'От',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
                // можно добавить slugify, если хотите задать собственные правила:
                // slugify: (input) =>
                //   input
                //     .toLowerCase()
                //     .replace(/[^\w\s-]/g, '')
                //     .replace(/\s+/g, '-')
                //     .slice(0, 96),
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'serviceType',
            title: 'Тип услуги',
            type: 'string',
            description:
                'Например, "монтаж", "демонтаж", "сервисное обслуживание", "заправка фреоном"',
            options: {
                list: [
                    { title: 'Монтаж', value: 'montage' },
                    { title: 'Демонтаж', value: 'demontage' },
                    { title: 'Сервисное обслуживание', value: 'maintenance' },
                    { title: 'Заправка фреоном', value: 'refill' },
                ],
            },
        }),
    ],
    preview: {
        select: {
            title: 'title',
            price: 'price',
        },
        // Здесь мы типизируем аргумент 'selection'
        prepare(selection: { title?: string; price?: number }) {
            const { title, price } = selection;
            return {
                title: title ?? '',
                subtitle: price ? `Цена: От ${price}₽` : 'Цена не указана',
            };
        },
    },
});
