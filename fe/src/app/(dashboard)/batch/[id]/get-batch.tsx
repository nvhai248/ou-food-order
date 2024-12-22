"use client";
import {
  CreateNewOrderService,
  GetBatchByDocumentIdService,
  UpdateShipperBatchService,
} from "@/core/services";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Orders from "./orders";
import { BatchDetailHeader } from "./header";
import CustomDialogOrderClassify from "./order-dialog";
import { Button } from "@/components/ui/button";
import { CreateOrderType } from "@/core/type";
import { ShowToast } from "@/components/show-toast";
import { FormatCurrency } from "@/helper";

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
    } catch (error) {}
  };

  const handleUploadBatch = async (note: string, id: string) => {
    try {
      await UpdateShipperBatchService(note, session?.jwt as string, id);
      ShowToast("Success pick shipper!", false);
    } catch (error) {
      ShowToast("Something went wrong!", true);
    }
  };

  const calculateTotal = (data: any) => {
    if (!data || !data.orders) {
      return 0;
    }

    return FormatCurrency(
      data.orders.reduce(
        (acc: any, curr: any) => acc + curr.food.price * curr.quantity,
        0
      )
    );
  };

  // Function to automatically pick a shipper based on a note from batch.orders
  const handleGenerateShipper = async () => {
    if (!data || !data.orders) {
      ShowToast("No orders found to generate a shipper!", true);
      return;
    }

    try {
      let index = Date.now() % data.orders.length;

      const shipperNote = data.orders[index].note;

      if (!shipperNote) {
        ShowToast("No valid shipper note found!", true);
        return;
      }

      await handleUploadBatch(shipperNote, id);

      setRefetch(Date.now());
    } catch (error) {
      ShowToast("Failed to generate shipper!", true);
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

          {data && data.state == "open" ? (
            <CustomDialogOrderClassify
              buttonTitle={<Button variant="outline">Create New</Button>}
              title="Create new order"
              description="Input all the detail about the order."
              action={createNewOrder}
              batchId={id}
            />
          ) : (
            <Button disabled>The batch is closed</Button>
          )}
        </div>

        <Orders
          id={data ? data.documentId : ""}
          data={data ? (data.orders ? data.orders : []) : []}
          refetch={setRefetch}
          state={data ? data.state : "close"}
        />

        <hr className="mb-4" />

        <div className="flex justify-between">
          <p>Total:</p>
          <span className="text-2xl text-blue-500">{calculateTotal(data)}</span>{" "}
        </div>

        <br />

        <div className="flex justify-between">
          <p>
            Shipper:{" "}
            <span>{data && data.shipper ? data.shipper : "No one"}</span>{" "}
          </p>

          {data && !data.shipper && (
            <Button onClick={handleGenerateShipper}>Generate shipper</Button>
          )}
        </div>
      </div>
    </div>
  );
}
