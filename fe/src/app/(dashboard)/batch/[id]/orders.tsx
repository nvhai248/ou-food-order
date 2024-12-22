"use client";

import CustomConfirmDialog from "@/components/confirm-dialog";
import ReuseTable from "@/components/reuse-table";
import { ShowToast } from "@/components/show-toast";
import { Button } from "@/components/ui/button";
import { DeleteOrderService, UpdateNewOrderService } from "@/core/services";
import { Action, Column } from "@/core/type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CustomDialogOrder from "./order-dialog";

interface OrdersProps {
  data: any;
  id: string;
  refetch?: any;
  state: any;
}

export default function Orders({ data, id, refetch, state }: OrdersProps) {
  const { data: session } = useSession();
  const route = useRouter();
  const columns: Column[] = [
    { header: "Note (name)", accessor: "note", sortField: "note", width: "20%" },
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
      width: "10%",
    },
    {
      header: "Quantity",
      accessor: "quantity",
      sortField: "quantity",
      width: "10%",
    },

    {
      header: "Created At",
      accessor: "createdAt",
      sortField: "createdAt",
      width: "20%",
    },
    {
      header: "Actions",
      accessor: "actions",
      sortField: "actions",
      width: "20%",
    },
  ];

  const handleUpdateOrder = async (order: any, id: string) => {
    try {
      await UpdateNewOrderService(order, session?.jwt as string, id);
      refetch(Date.now());
      ShowToast("Update success!", false);
    } catch (error) {
      ShowToast("Something went wrong!", true);
    }
  };

  const handleDeleteOrder = async (order: any) => {
    try {
      await DeleteOrderService(session?.jwt as string, order.documentId);
      refetch(Date.now());
      ShowToast("Update success!", false);
    } catch (error) {
      ShowToast("Something went wrong!", true);
    }
  };

  const actions: Action[] =
    state === "open"
      ? [
          {
            key: "update",
            component: (item: any) => (
              <CustomDialogOrder
                buttonTitle={
                  <Button className="btn bg-yellow-500">Update</Button>
                }
                title={`Update order ${item.note}`}
                description="Update the detail about the order."
                note={item.note}
                quantity={item.quantity}
                foodId={item.food.documentId}
                action={handleUpdateOrder}
                batchId={id}
                id={item.documentId}
              />
            ),
          },

          {
            key: "delete",
            component: (item: any) => (
              <CustomConfirmDialog
                confirmActionText="Delete"
                title={`Delete order ${item.name}`}
                description="Are you sure you want to delete this order?"
                buttonComponent={
                  <Button className="btn bg-red-500">Delete</Button>
                }
                action={() => handleDeleteOrder(item)}
              />
            ),
          },
        ]
      : [];

  return (
    <div>
      <div className="w-full max-h-[37rem] rounded-md overflow-y-auto scrollbar-custom">
        <ReuseTable columns={columns} data={data} actions={actions} />
      </div>
    </div>
  );
}
