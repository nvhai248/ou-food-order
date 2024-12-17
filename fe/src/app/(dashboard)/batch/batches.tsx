"use client";

import { ReusePagination } from "@/components/reuse-paging";
import ReuseTable from "@/components/reuse-table";
import { ShowToast } from "@/components/show-toast";
import { Button } from "@/components/ui/button";
import {
  DeleteBatchService,
  GetBatchesService,
  UpdateBatchService,
} from "@/core/services";
import { Action, Column } from "@/core/type";
import { Refreshed } from "@/helper";
import { DoorClosedIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const sParams = useSearchParams();

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
      header: "Actions",
      accessor: "actions",
      sortField: "actions",
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
      Refreshed(sParams, route);
    } catch (error) {
      ShowToast("Something went wrong!", true);
    }
  };

  const handleOpenBatch = async (batch: any) => {
    try {
      await UpdateBatchService(
        {
          state: "open",
        },
        session?.jwt as string,
        batch.documentId
      );

      ShowToast("Open success!", false);
      Refreshed(sParams, route);
    } catch (error) {
      ShowToast("Something went wrong!", true);
    }
  };

  const handleDeleteBatch = async (batch: any) => {
    try {
      await DeleteBatchService(session?.jwt as string, batch.documentId);

      ShowToast("Delete success!", false);
      Refreshed(sParams, route);
    } catch (error) {
      ShowToast("Something went wrong!", true);
    }
  };

  const actions: Action[] = [
    {
      key: "close",
      component: (item: any) => (
        <Button
          className="btn bg-yellow-500"
          onClick={() => handleCloseBatch(item)}
        >
          Close
        </Button>
      ),
    },
    {
      key: "open",
      component: (item: any) => (
        <Button
          className="btn bg-green-500"
          onClick={() => handleOpenBatch(item)}
        >
          Open
        </Button>
      ),
    },
    {
      key: "delete",
      component: (item: any) => (
        <Button
          className="btn bg-red-500"
          onClick={() => handleDeleteBatch(item)}
        >
          Delete
        </Button>
      ),
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
