"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [thumbnailStart, setThumbnailStart] = React.useState(0);

    const THUMBNAILS_PER_PAGE = 4;

    if (!images || images.length === 0) {
        return <p>Нет фотографий</p>;
    }

    const visibleThumbnails = images.slice(
        thumbnailStart,
        thumbnailStart + THUMBNAILS_PER_PAGE
    );

    const handlePrev = () => {
        if (selectedIndex > 0) {
            const newIndex = selectedIndex - 1;
            setSelectedIndex(newIndex);
            if (newIndex < thumbnailStart) {
                setThumbnailStart(newIndex);
            }
        }
    };

    const handleNext = () => {
        if (selectedIndex < images.length - 1) {
            const newIndex = selectedIndex + 1;
            setSelectedIndex(newIndex);
            if (newIndex >= thumbnailStart + THUMBNAILS_PER_PAGE) {
                setThumbnailStart(newIndex - THUMBNAILS_PER_PAGE + 1);
            }
        }
    };

    const handleThumbnailClick = (actualIndex: number) => {
        setSelectedIndex(actualIndex);
        if (actualIndex < thumbnailStart) {
            setThumbnailStart(actualIndex);
        } else if (actualIndex >= thumbnailStart + THUMBNAILS_PER_PAGE) {
            setThumbnailStart(actualIndex - THUMBNAILS_PER_PAGE + 1);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-full mx-auto p-2">
            {/* Большое изображение */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg">
                <Image
                    src={images[selectedIndex]}
                    alt={`Большое фото ${selectedIndex + 1}`}
                    fill
                    className="object-contain rounded-lg"
                />
            </div>

            {/* Блок миниатюр со стрелками */}
            <div className="mt-4 flex items-center justify-between">
                {/* Стрелка назад */}
                <button
                    onClick={handlePrev}
                    disabled={selectedIndex === 0}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F8F8F3] text-[#333] hover:bg-[#B4CC6E] disabled:opacity-50 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Контейнер миниатюр */}
                <div className="flex flex-1 mx-2 space-x-2">
                    {visibleThumbnails.map((imgUrl, i) => {
                        const actualIndex = thumbnailStart + i;
                        const isSelected = actualIndex === selectedIndex;
                        return (
                            <div
                                key={imgUrl + i}
                                onClick={() => handleThumbnailClick(actualIndex)}
                                className={`relative flex-1 aspect-square cursor-pointer rounded-lg transition-colors 
                  ${isSelected ? "border-2 border-[#C7E07A]" : "border-2 border-transparent hover:border-[#B4CC6E]"}
                `}
                            >
                                <Image
                                    src={imgUrl}
                                    alt={`Миниатюра ${actualIndex + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Стрелка вперёд */}
                <button
                    onClick={handleNext}
                    disabled={selectedIndex === images.length - 1}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F8F8F3] text-[#333] hover:bg-[#B4CC6E] disabled:opacity-50 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
