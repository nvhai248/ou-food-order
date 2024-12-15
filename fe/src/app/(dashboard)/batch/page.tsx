import Spinner from "@/components/ui/spinner";
import { Suspense } from "react";
import Batches from "./batches";
import CreateBatchButton from "./create";

export default async function PetsPage(props: {
  searchParams?: Promise<{
    pageSize?: string;
    pageNumber?: string;
    refreshed?: string;
    query?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  // Destructure searchParams without awaiting
  const searchParams = await props.searchParams;

  const input = {
    pageSize: parseInt(searchParams?.pageSize ?? "10"),
    pageNumber: parseInt(searchParams?.pageNumber ?? "1"),
    refreshed: searchParams?.refreshed,
    query: searchParams?.query,
    sortBy: searchParams?.sortBy ?? "name",
    sortOrder: searchParams?.sortOrder ?? "asc",
  };

  return (
    <div className="w-[100%] flex gap-4 p-4">
      <Suspense key={JSON.stringify(input)} fallback={<Spinner size={50} />}>
        <div className="w-full h-fit bg-gray-100 p-4 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">Batches</h3>
            {/* Create new pet type dialog */}
            <CreateBatchButton />
          </div>

          <Batches searchParams={input} />
        </div>
      </Suspense>
    </div>
  );
}
