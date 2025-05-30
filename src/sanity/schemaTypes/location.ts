export default {
    name: 'location',
    title: 'Локации',
    type: 'document',
    fields: [
        {
            name: 'latitude',
            title: 'Широта',
            type: 'number',
            description: 'Широта локации (например, 54.727900)',
        },
        {
            name: 'longitude',
            title: 'Долгота',
            type: 'number',
            description: 'Долгота локации (например, 20.534059)',
        },
        {
            name: 'altitude',
            title: 'Высота',
            type: 'number',
            description: 'Высота локации относительно уровня моря (если известна)',
        },
        {
            name: 'address',
            title: 'Адрес',
            type: 'string',
            description: 'Укажите адрес локации',
        },
    ],
};
