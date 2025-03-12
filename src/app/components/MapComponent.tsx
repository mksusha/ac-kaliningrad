'use client';
import { useEffect, useRef, useState } from "react";
import { createClient } from "next-sanity";

declare global {
    interface Window {
        ymaps?: any;
        ymapsLoaded?: boolean;
    }
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id", // Ваш проект ID
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", // Ваш dataset
    apiVersion: "2023-01-01", // Актуальная версия API
    useCdn: true, // Используем CDN для ускорения работы
});

const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [locations, setLocations] = useState<any[]>([]); // Состояние для локаций

    useEffect(() => {
        // Загружаем локации из Sanity
        const fetchLocations = async () => {
            const data = await client.fetch(`*[_type == "location"]{latitude, longitude, altitude, address}`);
            console.log(data); // Проверим, что данные приходят
            setLocations(data);
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        if (locations.length === 0) return; // Прерываем выполнение, если локации пустые

        const loadMap = () => {
            if (window.ymaps && mapRef.current) {
                window.ymaps.ready(() => {
                    // Вычисляем центр карты (среднее значение координат)
                    const centerLat = locations.reduce((sum, location) => sum + location.latitude, 0) / locations.length;
                    const centerLng = locations.reduce((sum, location) => sum + location.longitude, 0) / locations.length;

                    const map = new window.ymaps.Map(mapRef.current, {
                        center: [centerLat, centerLng], // Центр карты по средним координатам
                        zoom: 12, // Масштаб
                    });

                    // Добавляем метки на карту
                    locations.forEach(({ latitude, longitude, address }) => {
                        console.log(`Добавление метки: ${latitude}, ${longitude}, ${address}`);
                        const placemark = new window.ymaps.Placemark([latitude, longitude], {
                            balloonContent: `Адрес: ${address}`,
                        }, {
                            iconColor: '#C7E07A', // Цвет метки
                        });
                        map.geoObjects.add(placemark);
                    });
                });
            }
        };

        if (!window.ymapsLoaded) {
            window.ymapsLoaded = true;
            const script = document.createElement("script");
            const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API;
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
            script.async = true;
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, [locations]); // Зависимость от locations

    return (
        <div style={{ width: "100%", maxWidth: "1350px", margin: "0 auto" }}>
            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}
            />
        </div>
    );
};

export default MapComponent;
