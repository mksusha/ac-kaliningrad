'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        ymaps?: any;
        ymapsLoaded?: boolean;
    }
}

type Location = {
    latitude: number;
    longitude: number;
    altitude: number | null;
    address: string;
};

const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch('/api/locations', { cache: 'no-store' });
                const data: Location[] = await res.json();
                console.log('Локации из PostgreSQL:', data);
                setLocations(data);
            } catch (err) {
                console.error('Ошибка при загрузке локаций из PostgreSQL:', err);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        if (locations.length === 0) return;

        const loadMap = () => {
            if (window.ymaps && mapRef.current) {
                window.ymaps.ready(() => {
                    const centerLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
                    const centerLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;

                    const map = new window.ymaps.Map(mapRef.current, {
                        center: [centerLat, centerLng],
                        zoom: 12,
                    });

                    locations.forEach(({ latitude, longitude, address }) => {
                        const placemark = new window.ymaps.Placemark(
                            [latitude, longitude],
                            {
                                balloonContent: `Адрес: ${address}`,
                            },
                            {
                                iconColor: '#C7E07A',
                            }
                        );
                        map.geoObjects.add(placemark);
                    });
                });
            }
        };

        if (!window.ymapsLoaded) {
            window.ymapsLoaded = true;
            const script = document.createElement('script');
            const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API;
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
            script.async = true;
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, [locations]);

    return (
        <div style={{ width: '100%', maxWidth: '1350px', margin: '0 auto' }}>
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '400px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                }}
            />
        </div>
    );
};

export default MapComponent;
