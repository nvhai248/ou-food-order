"use client";

import { ReusePagination } from "@/components/reuse-paging";
import ReuseTable from "@/components/reuse-table";
import { GetBatchesService } from "@/core/services";
import { Column } from "@/core/type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface BatchesProps {
  searchParams: {
    pageSize?: number;
    pageNumber?: number;
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

        console.log(response);

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

  return (
    <div>
      <div className="w-full max-h-[37rem] rounded-md overflow-y-auto scrollbar-custom">
        <ReuseTable
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
          sortBy={searchParams.sortBy}
          sortOrder={searchParams.sortOrder}
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
