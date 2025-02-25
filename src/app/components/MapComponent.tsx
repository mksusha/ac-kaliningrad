'use client'
import { useEffect, useRef } from "react";

declare global {
    interface Window {
        ymaps: any;
    }
}

const locations = [
    { id: 1, coords: [54.7071, 20.5102] },
    { id: 2, coords: [54.7181, 20.5203] },
    { id: 3, coords: [54.6981, 20.5051] },
];

const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMap = () => {
            if (window.ymaps && mapRef.current) {
                window.ymaps.ready(() => {
                    const map = new window.ymaps.Map(mapRef.current, {
                        center: [54.7104, 20.5101],
                        zoom: 12,
                    });

                    locations.forEach(({ id, coords }) => {
                        const placemark = new window.ymaps.Placemark(coords, {
                            balloonContent: `Точка №${id}`,
                        });
                        map.geoObjects.add(placemark);
                    });
                });
            }
        };

        if (!window.ymaps) {
            const script = document.createElement("script");
            const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API;
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
            script.async = true;
            script.nonce = "random123"; // Добавляем nonce
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "500px", borderRadius: "10px", overflow: "hidden" }} />;
};

export default MapComponent;
