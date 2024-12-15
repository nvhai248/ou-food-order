"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { ShowToast } from "@/components/show-toast";
import { CreateNewBatchService } from "@/core/services";
import { useRouter, useSearchParams } from "next/navigation";
import CustomDialogOrderClassify from "./create-order-dialog";

export default function CreateOrderButton() {
  const [openCreateOrderDialog, setOpenCreateOrderDialog] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data } = useSession();

  const handleRefresh = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("refreshed", Date.now().toString());
    router.push(`?${params.toString()}`);
  };

  const createNewBatch = async (newName: string) => {
    try {
      await CreateNewBatchService(newName, data?.jwt as string);
      setOpenCreateOrderDialog(false);
      handleRefresh();
      ShowToast("Pet type has been created");
    } catch (error: any) {
      console.log(error.message);
      ShowToast("Fail. Something went wrong!", true);
    }
  };

  return (
    <CustomDialogOrderClassify
      open={openCreateOrderDialog}
      setOpen={setOpenCreateOrderDialog}
      buttonTitle={<Button variant="outline">Create New</Button>}
      title="Create new order"
      description="Input all the detail about the order."
      action={createNewBatch}
    />
  );
}
