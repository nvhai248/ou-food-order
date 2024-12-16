"use client";

import Refreshed from "@/components/refresh";
import { ReusePagination } from "@/components/reuse-paging";
import ReuseTable from "@/components/reuse-table";
import { ShowToast } from "@/components/show-toast";
import { GetBatchesService, UpdateBatchService } from "@/core/services";
import { Action, Column } from "@/core/type";
import { DoorClosedIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface BatchesProps {
  searchParams: {
    pageSize?: number;
    pageNumber?: number;
    refreshed?: string;
    query?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function Batches({ searchParams }: BatchesProps) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>();
  const route = useRouter();

  const columns: Column[] = [
    {
      header: "Id",
      accessor: "documentId",
      sortField: "documentId",
      width: "20%",
    },
    { header: "Name", accessor: "name", sortField: "name", width: "20%" },
    { header: "State", accessor: "state", sortField: "state", width: "20%" },
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
      width: "20%",
    },
  ];

  // Fetch pets data using useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await GetBatchesService(
          session?.jwt as string,
          {
            page: searchParams.pageNumber || 1,
            pageSize: searchParams.pageSize || 10,
          },
          searchParams.sortBy ? [searchParams.sortBy] : []
        );

        setData(response.data.batches);
      } catch (error) {
        console.log("Error fetching pets data:", error);
      }
    };

    if (session?.jwt) {
      fetchData();
    }
  }, [session, searchParams]);

  const handleRowClick = (batch: any) => {
    route.push(`/batch/${batch.documentId}`);
  };

  const handleCloseBatch = async (batch: any) => {
    try {
      await UpdateBatchService(
        {
          state: "close",
        },
        session?.jwt as string,
        batch.documentId
      );

      ShowToast("Close success!", false);
      Refreshed();
    } catch (error) {
      ShowToast("Something went wrong!", true);
    }
  };

  const actions: Action[] = [
    {
      title: "Close",
      className: "btn bg-yellow-500",
      handler: handleCloseBatch,
    },
    {
      title: "Delete",
      className: "btn bg-red-500",
      handler: handleCloseBatch,
    },
  ];

  return (
    <div>
      <div className="w-full max-h-[37rem] rounded-md overflow-y-auto scrollbar-custom">
        <ReuseTable
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
          sortBy={searchParams.sortBy}
          sortOrder={searchParams.sortOrder}
          actions={actions}
        />
      </div>

      <ReusePagination
        pageNumber={searchParams.pageNumber}
        totalPages={data?.totalPages}
      />

      {/* {selectedPet && (
        <DetailPetDialog
          pet={selectedPet}
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
        />
      )} */}
    </div>
  );
}
