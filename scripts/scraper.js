import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Добавляем импорт uuid

dotenv.config({ path: '.env.local' });

// Проверка переменных окружения
if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_DATASET || !process.env.SANITY_TOKEN) {
    console.error("Ошибка: Отсутствуют переменные окружения Sanity.");
    process.exit(1);
}

// Подключение к Sanity
const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    useCdn: false,
    apiVersion: '2023-01-01',
    token: process.env.SANITY_TOKEN,
});

const BASE_URL = 'https://daichi.ru/catalog/bytovoe-konditsionirovanie/';
const PAGES = 6;

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

// Функция для парсинга деталей кондиционера
async function scrapeProductDetails(productUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: 'load' });

    const data = await page.evaluate(() => {
        const title = document.querySelector('.product-card__title')?.innerText.trim();
        const description = document.querySelector('.product-card__main-description-text')?.innerText.trim();
        const images = Array.from(document.querySelectorAll('.product-card__image-slide img')).map(img => img.src);

        const specs = {};
        document.querySelectorAll('.product-card__stat-item').forEach((item) => {
            const key = item.querySelector('.product-card__stat-title')?.innerText.trim();
            const value = item.querySelector('.product-card__stat-value')?.innerText.trim();
            if (key && value) specs[key] = value;
        });

        return { title, description, images, specs };
    });

    await browser.close();

    // Добавляем уникальные ключи в характеристики
    const formattedSpecs = Object.entries(data.specs).map(([key, value]) => ({
        _key: uuidv4(),
        title: key.replace(/[^\w\s-]/g, ''), // Удаление спецсимволов
        value,
    }));

    return {
        ...data,
        specs: formattedSpecs, // Форматируем характеристики
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
            description: product.description,
            images: imageRefs,
            specs: product.specs,
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
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Задержка 1 секунда
    }

    console.log('🎉 Парсинг и загрузка завершены!');
})();
