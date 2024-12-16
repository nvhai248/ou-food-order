import { toast } from "sonner";
import { CheckCircle, CircleXIcon } from "lucide-react";
import { formatter } from "@/helper";

export const ShowToast = (message: string, isError = false) => {
  toast(message, {
    description: formatter.format(new Date()),
    icon: isError ? (
      <CircleXIcon className="text-red-500 mr-4" />
    ) : (
      <CheckCircle className="text-green-500 mr-4" />
    ),
    action: {
      label: "Close",
      onClick: () => {},
    },
  });
};
