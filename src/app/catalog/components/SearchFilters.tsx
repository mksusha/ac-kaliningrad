"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchFilters({ onCategoryChangeAction }: { onCategoryChangeAction: (category: string) => void }) {
    const searchParams = useSearchParams();
    const [category, setCategory] = useState<string>("");

    useEffect(() => {
        const initialCategory = searchParams.get("category") || "";
        if (initialCategory !== category) {
            setCategory(initialCategory);
            onCategoryChangeAction(initialCategory);
        }
    }, [searchParams, onCategoryChangeAction]);

    return null;
}
