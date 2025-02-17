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

// Функция для безопасного перехода по страницам
async function safeGoto(page, url) {
    try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    } catch (error) {
        console.error(`Ошибка при загрузке страницы ${url}, пробую снова...`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    }
}

// Функция для обновления товара в Sanity по совпадению названия
async function updateProductInSanity(product) {
    try {
        // Ищем товар по заголовку
        const query = `*[_type == "product" && title == $title][0]`;
        const existingProduct = await client.fetch(query, { title: product.title });

        if (existingProduct) {
            // Обновляем поля: холодопроизводительность, логотип статистики,
            // данные производителя и дилера
            const updateData = {
                cooling_capacity: product.coolingCapacity,
                statsLogo: product.statsLogo,
                manufacturer: product.manufacturer,
                dealer: product.dealer,
            };

            await client.patch(existingProduct._id)
                .set(updateData)
                .commit();
            console.log(`✅ Обновлён товар: ${product.title}`);
        } else {
            console.log(`❌ Товар с названием "${product.title}" не найден в Sanity.`);
        }
    } catch (error) {
        console.error('Ошибка обновления товара в Sanity:', error);
    }
}

// Функция для парсинга списка товаров (ссылок, заголовков)
async function scrapePage(pageUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await safeGoto(page, pageUrl);

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

// Функция для парсинга деталей товара (без specs, только нужные блоки)
async function scrapeProductDetails(productUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await safeGoto(page, productUrl);

    const data = await page.evaluate(() => {
        // Базовые данные
        const title = document.querySelector('.page__title.h1.is--small')?.innerText.trim();
        const images = Array.from(document.querySelectorAll('.product-card__image-slide img')).map(img => img.src);

        // Извлекаем значение холодопроизводительности, кВт
        let coolingCapacity = "";
        const statItems = Array.from(document.querySelectorAll('.product-card__stat-item'));
        statItems.forEach(item => {
            const statTitle = item.querySelector('.product-card__stat-title')?.innerText.trim();
            const statValue = item.querySelector('.product-card__stat-value')?.innerText.trim();
            if (statTitle && statTitle.includes("Холодопроизводительность")) {
                coolingCapacity = statValue;
            }
        });

        // Логотип статистики
        const statsLogo = document.querySelector('.product-card__stats-logo')?.getAttribute('src') || "";

        // Данные производителя (без дилера)
        const manufacturerBlock = document.querySelector('.product-card__link-block:not(.product-card__link-block--dealer)');
        let manufacturerLogo = "";
        let manufacturerLink = "";
        let manufacturerDesc = "";
        if (manufacturerBlock) {
            const logoEl = manufacturerBlock.querySelector('.product-card__link-logo');
            manufacturerLogo = logoEl ? logoEl.getAttribute('src') || "" : "";
            const linkEl = manufacturerBlock.querySelector('a.button');
            manufacturerLink = linkEl ? linkEl.getAttribute('href') || "" : "";
            const descEl = manufacturerBlock.querySelector('.product-card__link-desc');
            manufacturerDesc = descEl ? descEl.innerText.trim() : "";
        }

        // Данные дилера
        const dealerBlock = document.querySelector('.product-card__link-block.product-card__link-block--dealer');
        let dealerLink = "";
        let dealerDesc = "";
        if (dealerBlock) {
            const linkEl = dealerBlock.querySelector('a.button');
            dealerLink = linkEl ? linkEl.getAttribute('href') || "" : "";
            const descEl = dealerBlock.querySelector('.product-card__link-desc');
            dealerDesc = descEl ? descEl.innerText.trim() : "";
        }

        return {
            title,
            images,
            coolingCapacity,
            statsLogo,
            manufacturer: {
                logo: manufacturerLogo,
                link: manufacturerLink,
                desc: manufacturerDesc
            },
            dealer: {
                link: dealerLink,
                desc: dealerDesc
            }
        };
    });

    await browser.close();
    return data;
}

// Основной процесс: парсинг страниц, деталей товаров и обновление в Sanity
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
        await updateProductInSanity(details);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // задержка 5 секунд между обновлениями
    }

    console.log('🎉 Обновление товаров завершено!');
})();
