"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import CustomConfirmDialog from "@/components/confirm-dialog";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await GetBatchesService(session?.jwt as string, {
          page: searchParams.pageNumber || 1,
          pageSize: searchParams.pageSize || 10,
        });
        setData(response.data.batches);
      } catch (error) {
        console.error("Error fetching batches:", error);
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
        { state: "close" },
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
        { state: "open" },
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
        <CustomConfirmDialog
          confirmActionText="Close"
          title={`Close batch ${item.name}`}
          description="Are you sure you want to close this batch?"
          buttonComponent={<Button className="btn bg-yellow-500">Close</Button>}
          action={() => handleCloseBatch(item)}
        />
      ),
    },
    {
      key: "open",
      component: (item: any) => (
        <CustomConfirmDialog
          confirmActionText="Open"
          title={`Open batch ${item.name}`}
          description="Are you sure you want to open this batch?"
          buttonComponent={<Button className="btn bg-green-500">Open</Button>}
          action={() => handleOpenBatch(item)}
        />
      ),
    },
    {
      key: "delete",
      component: (item: any) => (
        <CustomConfirmDialog
          confirmActionText="Delete"
          title={`Delete batch ${item.name}`}
          description="Are you sure you want to delete this batch?"
          buttonComponent={<Button className="btn bg-red-500">Delete</Button>}
          action={() => handleDeleteBatch(item)}
        />
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
    </div>
  );
}
