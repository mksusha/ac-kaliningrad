"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchFilters({ onCategoryChangeAction }: { onCategoryChangeAction: (category: string) => void }) {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "";

    useEffect(() => {
        onCategoryChangeAction(initialCategory);
    }, [initialCategory, onCategoryChangeAction]); // Теперь корректное имя

    return null;
}
