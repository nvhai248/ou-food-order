"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "./ui/spinner";
import { Column } from "@/core/type";
import { SORT_ORDER } from "@/core/constants";
import { FormatDate, formatter } from "@/helper";

interface ReusableTableProps<T> {
  columns: Column[];
  data: T[] | undefined;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: string;
  fontSize?: number;
  isLoading?: boolean;
}

const ReuseTable = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick = () => {},
  sortBy,
  sortOrder,
  fontSize,
  isLoading = false,
}: ReusableTableProps<T>) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper function to get nested value from an object
  const getNestedValue = (
    obj: any,
    path: string
  ): string | number | undefined => {
    const result = path.split(".").reduce((acc, part) => acc?.[part], obj);
    if (
      typeof result === "string" &&
      !isNaN(Date.parse(result)) &&
      path != "name"
    ) {
      const date = new Date(result);
      return formatter.format(date);
    }
    return result ?? "-";
  };

  // Generate sort icon based on the current sort field and order
  const genSortIcon = (sortField: string) => {
    if (sortBy === sortField) {
      return sortOrder === SORT_ORDER.ASC ? (
        <ChevronUpIcon className="inline-block w-[15px] h-[15px] ml-1" />
      ) : (
        <ChevronDownIcon className="inline-block w-[15px] h-[15px] ml-1" />
      );
    }
    return null;
  };

  const handleSortClick = (sortField?: string) => {
    if (!sortField) return;
    const urlParams = new URLSearchParams(window.location.search);
    const currentSortBy = urlParams.get("sortBy");
    const currentSortOrder = urlParams.get("sortOrder");

    // Toggle the sort order if the same column is clicked again
    const newSortOrder =
      currentSortBy === sortField && currentSortOrder === SORT_ORDER.ASC
        ? SORT_ORDER.DESC
        : SORT_ORDER.ASC;

    urlParams.set("sortBy", sortField);
    urlParams.set("sortOrder", newSortOrder);
    router.replace(`?${urlParams.toString()}`);
  };

  const renderedRows = useMemo(() => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center">
            <Spinner size={50} />
          </TableCell>
        </TableRow>
      );
    }

    if (!data || data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return data.map((item, index) => (
      <TableRow
        key={index}
        onClick={() => onRowClick(item)}
        className="cursor-pointer hover:bg-gray-100 transition-colors"
      >
        {columns.map((column) => (
          <TableCell key={column.accessor}>
            {column.accessor === "state" ? (
              item.state === "open" ? (
                <Badge className="bg-green-500">{item.state}</Badge>
              ) : (
                <Badge className="bg-red-500">{item.state}</Badge>
              )
            ) : column.accessor === "createdAt" ? (
              FormatDate(item.createdAt)
            ) : (
              getNestedValue(item, column.accessor)
            )}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [data, columns, isLoading]);

  return (
    <Table style={{ fontSize }}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.accessor}
              onClick={() => handleSortClick(column.sortField)}
              style={{
                width: column.width,
                cursor: column.sortField ? "pointer" : "default",
              }}
              aria-sort={
                column.sortField === sortBy
                  ? sortOrder === SORT_ORDER.ASC
                    ? "ascending"
                    : "descending"
                  : undefined
              }
              tabIndex={0}
              role="columnheader"
            >
              {column.header}
              {column.sortField && genSortIcon(column.sortField)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>{renderedRows}</TableBody>
    </Table>
  );
};

export default ReuseTable;
