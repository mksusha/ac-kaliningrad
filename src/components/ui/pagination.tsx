
import * as React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const accentColor = "#C7E07A";
const accentHoverColor = "#B4CC6E";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>
(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>
(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, "size"> & React.ComponentProps<"a">;

const PaginationLink = ({
                            className,
                            isActive,
                            size = "icon",
                            ...props
                        }: PaginationLinkProps) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
            }),
            isActive && `bg-[${accentColor}] hover:bg-[${accentHoverColor}]`,
            className
        )}
        {...props}
    />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, onClick, ...props }: React.ComponentProps<typeof PaginationLink> & { onClick: () => void }) => (
    <PaginationLink
        aria-label="Назад"
        size="default"
        className={cn("gap-1 pl-2.5 text-black", className)}
        onClick={onClick}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
        <span>Назад</span>
    </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, onClick, ...props }: React.ComponentProps<typeof PaginationLink> & { onClick: () => void }) => (
    <PaginationLink
        aria-label="Далее"
        size="default"
        className={cn("gap-1 pr-2.5 text-black", className)}
        onClick={onClick}
        {...props}
    >
        <span>Далее</span>
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Больше страниц</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationComponent = ({ totalPages, initialPage }: { totalPages: number; initialPage: number }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const pages: (number | string)[] = [1];

    if (currentPage > 3) {
        pages.push("...");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - 2) {
        pages.push("...");
    }

    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return (
        <Pagination>
            <PaginationContent>
                {currentPage > 1 && <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />}
                {pages.map((page, index) => (
                    <PaginationItem key={index}>
                        {typeof page === "number" ? (
                            <PaginationLink onClick={() => setCurrentPage(page)} isActive={page === currentPage}>
                                {page}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}
                {currentPage < totalPages && <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />}
            </PaginationContent>
        </Pagination>
    );
};

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    PaginationComponent,
};
