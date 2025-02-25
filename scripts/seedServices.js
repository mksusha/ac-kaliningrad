// scripts/seedServices.js
import 'dotenv/config';
import { createClient } from 'next-sanity';

const client = createClient({
    projectId: "2y01oix2", // Ваш действительный projectId
    dataset: "production", // Обычно используется production
    token: "skGpyILeZJ7AnXVmDnuB3n2LcMYt3dl0Bhm4fV2BuBYeq98FtqqzmDou8rK9GQXcL816xaK2Q9pp76uD8w1I3rq8lCSeQ1iQ3pmcrqW1YgIRd1ynJfgdqvNyp3ie0djFncEp4uGyVI2uzaz8MK2bgGYjjXEAxU8A8QM3nDNSzfp7kAKyFWfZ",
    apiVersion: "2025-02-11",   // Дата версии API
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
