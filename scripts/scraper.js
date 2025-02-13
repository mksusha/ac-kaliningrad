import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_DATASET || !process.env.SANITY_TOKEN) {
    console.error("Ошибка: Отсутствуют переменные окружения Sanity.");
    process.exit(1);
}

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    useCdn: false,
    apiVersion: '2023-01-01',
    token: process.env.SANITY_TOKEN,
});

const BASE_URL = 'https://daichi.ru/catalog/bytovoe-konditsionirovanie/';
const PAGES = 6;

// Функция для извлечения категории из хлебных крошек
function extractCategory(breadcrumbs) {
    const categories = {
        'Настенные кондиционеры': 'wall',
        'Облачные кондиционеры': 'cloud',
        'Мобильные кондиционеры': 'mobile',
        'Оконные кондиционеры': 'window'
    };

    for (const crumb of breadcrumbs) {
        if (categories[crumb]) {
            return categories[crumb];
        }
    }
    return null;
}

// Функция для извлечения бренда из названия
function extractBrand(title) {
    const brands = [
        'AIRWAVE',
        'Aurum',
        'Axioma',
        'BOSCH',
        'Daichi',
        'DAICHIxMES',
        'DAICHIxMTC',
        'Daikin',
        'Kentatsu',
        'Midea',
        'Primera'
    ];
    for (const brand of brands) {
        if (title.toLowerCase().includes(brand.toLowerCase())) {
            return brand;
        }
    }
    return null;
}

// Функция транслитерации: преобразует кириллицу в латиницу
function transliterate(text) {
    const rusToLat = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    return text
        .split('')
        .map(char => {
            const lowerChar = char.toLowerCase();
            return rusToLat[lowerChar] !== undefined ? rusToLat[lowerChar] : char;
        })
        .join('');
}

// Функция форматирования ключей характеристик
function formatSpecKey(key) {
    // Заменяем пробелы на подчёркивания и приводим к нижнему регистру
    let replaced = key.replace(/\s+/g, '_').toLowerCase();
    // Транслитерируем кириллицу в латиницу
    let transliterated = transliterate(replaced);
    // Удаляем все символы, кроме латинских букв, цифр, подчёркиваний и дефисов
    transliterated = transliterated.replace(/[^a-z0-9_-]/g, '');
    // Объединяем несколько подряд идущих подчёркиваний в одно
    return transliterated.replace(/_+/g, '_');
}

// Объект сопоставления спарсенных ключей с ключами из схемы
const specsMapping = {
    proizvoditelnost: "cooling_power",                // Производительность → Охлаждение (кВт)
    nagrev: "heating_power",                           // Нагрев → Нагрев (кВт)
    elektropitanie: "power_supply",                    // Электропитание → Электропитание (Ф / В / Гц)
    energoeffektivnost_klass: "energy_efficiency",     // Энергоэффективность → Энергоэффективность (EER)
    nagrev_cop: "heating_efficiency",                  // Нагрев (cop) → Эффективность нагрева (COP)
    uroven_zvukovogo_davleniya: "noise_level",         // Уровень звукового давления → Уровень шума (дБА)
    gabarity_shkhvkhg: "dimensions_inner",             // Габариты (шхвхг) → Размеры внутреннего блока (мм)
    naruzhnyy_blok: "dimensions_outer",                // Наружный блок → Размеры наружного блока (мм)
    ves: "weight_inner",                               // Вес → Вес внутреннего блока (кг) (можно изменить при необходимости)
    khladagent: "refrigerant_type",                    // Хладагент → Тип хладагента
    zapravka: "refrigerant_charge",                    // Заправка → Заправка хладагента (кг)
    truboprovod_khladagenta: "pipe_liquid",            // Трубопровод хладагента → Диаметр трубки жидкости (мм)
    diametr_dlya_gaza: "pipe_gas",                     // Диаметр для газа → Диаметр трубки газа (мм)
    dlina_mezhdu_blokami: "pipe_length",               // Длина между блоками → Длина трубопровода (м)
    perepad_mezhdu_blokami: "pipe_difference",         // Перепад между блоками → Перепад высот (м)
    diapazon_rabochikh_temperatur_naruzhnogo_vozdukha: "working_temp_cooling", // Диапазон рабочих температур наружного воздуха → Диапазон температур охлаждения (°C)
    srok_ekspluatatsii: "lifetime",                    // Срок эксплуатации → Срок эксплуатации
    strana_izgotovitel: "manufacturer_country"         // Страна изготовитель → Страна производства
    // Поля типа "model" и "stoimost" не обрабатываются, так как они определены отдельно (models, prices)
};

// Функция для парсинга списка товаров
async function scrapePage(pageUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'load' });

    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.catalog__product-item')).map((product) => {
            const title = product.querySelector('.catalog__product-title')?.innerText.trim();
            const link = product.querySelector('.catalog__product-link')?.href;
            const image = product.querySelector('.catalog__product-image img')?.src;
            return { title, link, image };
        });
    });

    await browser.close();
    return products;
}

// Функция для парсинга деталей товара
async function scrapeProductDetails(productUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: 'load' });

    const data = await page.evaluate(() => {
        const title = document.querySelector('.page__title.h1.is--small')?.innerText.trim();
        const description = document.querySelector('.product-card__main-description-text')?.innerText.trim();
        const images = Array.from(document.querySelectorAll('.product-card__image-slide img')).map(img => img.src);

        // Получаем хлебные крошки
        const breadcrumbs = Array.from(document.querySelectorAll('.breadcrumbs__nav-item a')).map(el => el.innerText.trim());

        // Извлекаем модели (при наличии)
        const models = Array.from(document.querySelectorAll('.chars-table__table tr:nth-child(1) th span'))
            .slice(1)
            .map(el => el.innerText.trim());

        // Извлекаем характеристики товара
        const specs = [];
        document.querySelectorAll('.chars-table__table tr').forEach((row) => {
            const cells = row.querySelectorAll('td, th');
            if (cells.length > 2) {
                const title = cells[0]?.innerText.trim();
                const values = Array.from(cells).slice(3).map(el => el.innerText.trim());
                specs.push({ title, values });
            }
        });

        // Сбор цен
        const prices = Array.from(document.querySelectorAll('.chars-table__price span')).map(el => el.innerText.trim());

        // Ссылки на покупку и документы – пока пустые
        const buyLinks = [];
        const documents = [];

        return { title, description, images, breadcrumbs, models, specs, prices, buyLinks, documents };
    });

    await browser.close();

    const category = extractCategory(data.breadcrumbs);
    const brand = extractBrand(data.title);

    // Форматирование характеристик с применением мэппинга:
    const formattedSpecs = {};
    data.specs.forEach(spec => {
        if (spec.title && spec.values.length > 0) {
            const rawKey = formatSpecKey(spec.title);
            // Если для данного ключа есть сопоставление со схемой – включаем его
            if (specsMapping.hasOwnProperty(rawKey)) {
                formattedSpecs[specsMapping[rawKey]] = spec.values.join(', ');
            }
        }
    });

    return {
        ...data,
        category,
        brand,
        specs: formattedSpecs
    };
}

// Функция загрузки изображений в Sanity
async function uploadImageToSanity(imageUrl) {
    try {
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream',
        });

        const tempPath = path.join('/tmp', path.basename(imageUrl));
        const writer = fs.createWriteStream(tempPath);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const asset = await client.assets.upload('image', fs.createReadStream(tempPath), {
            filename: path.basename(imageUrl),
        });

        return asset._id;
    } catch (error) {
        console.error(`Ошибка загрузки изображения ${imageUrl}:`, error);
        return null;
    }
}

// Функция загрузки данных в Sanity
async function uploadToSanity(product) {
    try {
        const imageRefs = [];
        for (const imageUrl of product.images) {
            const imageId = await uploadImageToSanity(imageUrl);
            if (imageId) {
                imageRefs.push({ _type: 'image', asset: { _type: 'reference', _ref: imageId }, _key: uuidv4() });
            }
        }

        const doc = {
            _type: 'product',
            title: product.title,
            brand: product.brand,
            category: product.category,
            description: product.description,
            images: imageRefs,
            models: product.models,
            specs: product.specs,
            prices: product.prices,
            buy_links: product.buyLinks,
            documents: product.documents
        };

        console.log("📤 Загружаем в Sanity:", doc);

        await client.create(doc);
        console.log(`✅ Добавлен товар: ${product.title}`);
    } catch (error) {
        console.error('Ошибка загрузки в Sanity:', error);
    }
}

// Основной процесс парсинга и загрузки
(async () => {
    let allProducts = [];

    for (let i = 1; i <= PAGES; i++) {
        const pageUrl = `${BASE_URL}?PAGEN_1=${i}`;
        console.log(`🔍 Парсим страницу: ${pageUrl}`);

        const products = await scrapePage(pageUrl);
        allProducts.push(...products);
    }

    for (const product of allProducts) {
        console.log(`📦 Парсим товар: ${product.title}`);
        const details = await scrapeProductDetails(product.link);
        await uploadToSanity(details);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Задержка 1 секунда
    }

    console.log('🎉 Парсинг и загрузка завершены!');
})();
