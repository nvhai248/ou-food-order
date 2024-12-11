"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReusePaginationProps {
  pageNumber?: number;
  totalPages?: number;
}

export function ReusePagination({
  pageNumber = 1,
  totalPages = 10,
}: ReusePaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNumber", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (pageSize: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", pageSize);
    params.set("pageNumber", "1");
    router.push(`?${params.toString()}`);
  };

  // Helper function to generate page numbers (max 5 pages)
  const renderPageLinks = () => {
    const pages = [];

    // Determine when to show ellipses
    const showLeftEllipsis = pageNumber > 3;
    const showRightEllipsis = pageNumber < totalPages - 2;

    // Render first page
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          isActive={pageNumber === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Render left ellipsis if needed
    if (showLeftEllipsis) {
      pages.push(<PaginationEllipsis key="left-ellipsis" />);
    }

    // Render middle pages
    const startPage = Math.max(2, pageNumber - 1);
    const endPage = Math.min(totalPages - 1, pageNumber + 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === pageNumber}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Render right ellipsis if needed
    if (showRightEllipsis) {
      pages.push(<PaginationEllipsis key="right-ellipsis" />);
    }

    // Render last page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={pageNumber === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-between mt-4">
      {/* Pagination Section */}
      <div>
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(Math.max(pageNumber - 1, 1))}
                className={`${pageNumber === 1 ? "hidden" : ""}`}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {renderPageLinks()}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(Math.min(pageNumber + 1, totalPages))
                }
                className={`${pageNumber >= totalPages ? "hidden" : ""}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Page Size Selector */}
      <Select onValueChange={handlePageSizeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={`${
              searchParams.get("pageSize") || "Select a page size"
            }`}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Page size</SelectLabel>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}