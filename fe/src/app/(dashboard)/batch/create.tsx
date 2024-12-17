"use client";

import { useState } from "react";
import CustomDialogBatchType from "./dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { ShowToast } from "@/components/show-toast";
import { CreateNewBatchService } from "@/core/services";
import { Refreshed } from "@/helper";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateBatchButton() {
  const [openCreatePetDialog, setOpenCreatePetDialog] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data } = useSession();

  const createNewBatch = async (newName: string) => {
    try {
      await CreateNewBatchService(newName, data?.jwt as string);
      setOpenCreatePetDialog(false);
      Refreshed(searchParams, router);

      ShowToast("Pet type has been created");
    } catch (error: any) {
      console.log(error.message);
      ShowToast("Fail. Something went wrong!", true);
    }
  };

  return (
    <CustomDialogBatchType
      open={openCreatePetDialog}
      setOpen={setOpenCreatePetDialog}
      buttonTitle={<Button variant="outline">Create New</Button>}
      title="Create new batch"
      description="Enter Batch name and then every one can order."
      action={createNewBatch}
    />
  );
}
