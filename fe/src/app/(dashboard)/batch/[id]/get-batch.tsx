"use client";
import { GetBatchByDocumentIdService } from "@/core/services";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Orders from "./orders";
import CreateOrderButton from "./create-order";

interface Props {
  id?: string;
}

export default function GetBatch({ id }: Props) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>();

  // Fetch pets data using useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await GetBatchByDocumentIdService(
          session?.jwt as string,
          id as string
        );

        console.log(response);

        setData(response.data.batch);
      } catch (error) {
        console.log("Error fetching pets data:", error);
      }
    };

    if (session?.jwt && id) {
      fetchData();
    }
  }, [session, id]);

  console.log(data);

  return (
    <div className="w-[100%] flex gap-4 p-4">
      <div className="w-full h-fit bg-gray-100 p-4 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">{data ? data.name : ""}</h3>
          {/* Create new pet type dialog */}
          <CreateOrderButton />
        </div>

        <Orders data={data ? (data.orders ? data.orders : []) : []} />
      </div>
    </div>
  );
}
