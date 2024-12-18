"use client";
import {
  CreateNewOrderService,
  GetBatchByDocumentIdService,
} from "@/core/services";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Orders from "./orders";
import { BatchDetailHeader } from "./header";
import CustomDialogOrderClassify from "./order-dialog";
import { Button } from "@/components/ui/button";
import { CreateOrderType } from "@/core/type";
import { ShowToast } from "@/components/show-toast";

interface Props {
  id: string;
}

export default function GetBatch({ id }: Props) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>();
  const [refetch, setRefetch] = useState<number>();

  const fetchData = async (token: string) => {
    try {
      const response: any = await GetBatchByDocumentIdService(
        token,
        id as string
      );

      setData(response.data.batch);
    } catch (error) {
      console.log("Error fetching pets data:", error);
    }
  };

  useEffect(() => {
    if (session?.jwt && id) {
      fetchData(session.jwt);
    }
  }, [session, id, refetch]);

  const createNewOrder = async (data: CreateOrderType) => {
    try {
      await CreateNewOrderService(data, session?.jwt as string);
      setRefetch(Date.now());
      ShowToast("Order has been created!");
    } catch (error: any) {
      console.log(error.message);
      ShowToast("Fail. Something went wrong!", true);
    }
  };

  return (
    <div className="w-[100%] flex gap-4 p-4">
      <div className="w-full h-fit bg-gray-100 p-4 rounded-lg shadow">
        <BatchDetailHeader
          title={data ? data.name : ""}
          id={data ? data.documentId : ""}
        />
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">{data ? data.name : ""}</h3>

          <CustomDialogOrderClassify
            buttonTitle={<Button variant="outline">Create New</Button>}
            title="Create new order"
            description="Input all the detail about the order."
            action={createNewOrder}
            batchId={id}
          />
        </div>

        <Orders
          id={data ? data.documentId : ""}
          data={data ? (data.orders ? data.orders : []) : []}
          refetch={setRefetch}
        />
      </div>
    </div>
  );
}
