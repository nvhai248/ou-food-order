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
import { Action, Column } from "@/core/type";
import { SORT_ORDER } from "@/core/constants";
import {
  ConvertToNumber,
  FormatCurrency,
  FormatDate,
  formatter,
} from "@/helper";
import { Button } from "./ui/button";

interface ReusableTableProps<T> {
  columns: Column[];
  data: T[] | undefined;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: string;
  fontSize?: number;
  isLoading?: boolean;
  actions?: Action[];
}

const isVisibleAction = (data: any, keyAction: string) => {
  if (!data) return false;

  if (
    (data.state === "close" && keyAction === "close") ||
    (data.state === "open" && keyAction === "open")
  ) {
    return false;
  }

  return true;
};

const ReuseTable = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick = () => {},
  sortBy,
  sortOrder,
  fontSize,
  isLoading = false,
  actions,
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
      !path.includes("name") &&
      !path.includes("note")
    ) {
      const date = new Date(result);
      return formatter.format(date);
    }

    if (path.includes("price")) {
      return FormatCurrency(result);
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
        className="cursor-pointer hover:bg-gray-100 transition-colors"
      >
        {columns.map((column) => {
          const renderCellContent = () => {
            switch (column.accessor) {
              case "state":
                return item.state === "open" ? (
                  <Badge className="bg-green-500">{item.state}</Badge>
                ) : (
                  <Badge className="bg-red-500">{item.state}</Badge>
                );
              case "createdAt":
                return FormatDate(item.createdAt);
              case "updatedAt":
                return FormatDate(item.updatedAt);
              case "actions":
                return (
                  <div className="flex gap-4">
                    {actions?.map((action) =>
                      action.component && isVisibleAction(item, action.key) ? (
                        <div key={action.key}>{action.component(item)}</div>
                      ) : null
                    )}
                  </div>
                );
              case "total":
                return FormatCurrency(item.quantity * item.food.price);
              default:
                return getNestedValue(item, column.accessor);
            }
          };

          return (
            <TableCell
              onClick={() => {
                column.accessor !== "actions" && onRowClick(item);
              }}
              key={column.accessor}
            >
              {renderCellContent()}
            </TableCell>
          );
        })}
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
