export default {
    name: 'location',
    title: 'Локации',
    type: 'document',
    fields: [
        {
            name: 'latitude',
            title: 'Широта',
            type: 'number', // Для хранения значения широты
            description: 'Широта локации (например, 54.727900)',
        },
        {
            name: 'longitude',
            title: 'Долгота',
            type: 'number', // Для хранения значения долготы
            description: 'Долгота локации (например, 20.534059)',
        },
        {
            name: 'altitude',
            title: 'Высота',
            type: 'number', // Для хранения значения высоты
            description: 'Высота локации относительно уровня моря (если известна)',
        },
        {
            name: 'address',
            title: 'Адрес',
            type: 'string', // Адрес в виде строки
            description: 'Укажите адрес локации',
        },
    ],
};
