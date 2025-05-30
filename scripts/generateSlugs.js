
import { createClient } from 'next-sanity';
import 'dotenv/config';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your_project_id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN || 'your_write_token',
    apiVersion: '2023-01-01',
    useCdn: false,
});

const services = [
    {
        _type: 'service',
        title: 'Стандартный монтаж сплит-системы',
        description: `Бурение отверстия 1шт;
Прокладка трассы до 3х метров (труба фреоновая во Флексе, труба газовая во Флексе, кабель меж.блочный)
Навешивание внутреннего и наружнего блоков
Подключение
Вакумирование
Пусконаладка`,
        price: 12500,
        priceLabel: 'От',
        serviceType: 'montage',
    },
    {
        _type: 'service',
        title: 'Демонтаж внутреннего и наружного блоков',
        description: 'Демонтаж внутреннего и наружного блоков',
        price: 5000,
        priceLabel: 'От',
        serviceType: 'demontage',
    },
    {
        _type: 'service',
        title: 'Сервисное Тех.обслуживание',
        description: 'Сервисное техническое обслуживание кондиционеров',
        price: 3500,
        priceLabel: 'От',
        serviceType: 'maintenance',
    },
    {
        _type: 'service',
        title: 'Заправка фреоном',
        description: 'Заправка хладагента (фреон)',
        serviceType: 'refill',
    },
    {
        _type: 'service',
        title: 'Пайка медной трубы',
        description: 'Пайка медной трубы для кондиционеров',
        serviceType: 'maintenance',
    },
];

async function seedServices() {
    try {
        for (const service of services) {
            const created = await client.create(service);
            console.log(`Создан документ с ID: ${created._id} и названием: ${created.title}`);
        }
    } catch (error) {
        console.error('Ошибка при создании документа:', error);
    }
}

seedServices();
