import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  title: string;
  description: string;
  buttonComponent: any;
  action: () => void;
  confirmActionText: string;
}

export default function CustomConfirmDialog({
  title,
  description,
  buttonComponent,
  action,
  confirmActionText,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    action();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonComponent}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm} variant="default">
            {confirmActionText}
          </Button>
          <Button onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
