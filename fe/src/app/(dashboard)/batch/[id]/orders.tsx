"use client";

import ReuseTable from "@/components/reuse-table";
import { Column } from "@/core/type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

interface OrdersProps {
  data: any;
}

export default function Orders({ data }: OrdersProps) {
  const { data: session } = useSession();
  const route = useRouter();
  const columns: Column[] = [
    {
      header: "Food",
      accessor: "food.name",
      sortField: "food.name",
      width: "20%",
    },
    {
      header: "Price",
      accessor: "food.price",
      sortField: "food.price",
      width: "20%",
    },
    {
      header: "Quantity",
      accessor: "quantity",
      sortField: "quantity",
      width: "10%",
    },
    { header: "Note", accessor: "note", sortField: "note", width: "20%" },
    {
      header: "Created At",
      accessor: "createdAt",
      sortField: "createdAt",
      width: "20%",
    },
    {
      header: "Action",
      accessor: "action",
      sortField: "action",
      width: "10%",
    },
  ];

  const handleRowClick = (batch: any) => {
    console.log(batch);
  };

  return (
    <div>
      <div className="w-full max-h-[37rem] rounded-md overflow-y-auto scrollbar-custom">
        <ReuseTable columns={columns} data={data} onRowClick={handleRowClick} />
      </div>
    </div>
  );
}
