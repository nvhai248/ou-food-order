"use client";

import { useState } from "react";
import CustomDialogBatchType from "./dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { ShowToast } from "@/components/show-toast";
import { CreateNewBatchService } from "@/core/services";
import Refreshed from "@/components/refresh";

export default function CreateBatchButton() {
  const [openCreatePetDialog, setOpenCreatePetDialog] = useState(false);

  const { data } = useSession();

  const createNewBatch = async (newName: string) => {
    try {
      await CreateNewBatchService(newName, data?.jwt as string);
      setOpenCreatePetDialog(false);
      Refreshed();

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
      title="Create new pet classify"
      description="Input the pet classify name and save after done."
      action={createNewBatch}
    />
  );
}
