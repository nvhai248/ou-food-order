"use client";

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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { ShowToast } from "@/components/show-toast";
import { useSession } from "next-auth/react";
import { GetFoodsServices } from "@/core/services";
import { Textarea } from "@/components/ui/textarea";
import { CreateOrderType } from "@/core/type";
import { FormatCurrency } from "@/helper";

interface Props {
  title: string;
  description: string;
  buttonTitle: React.ReactNode;
  action: any;
  id?: string;
  foodId?: string;
  batchId?: string;
  quantity?: number;
  note?: string;
}

const formSchema = z.object({
  note: z.string().min(1, { message: "You must enter a note!" }),
  quantity: z.number().min(1, { message: "You must enter a quantity!" }),
  foodId: z.string().min(1, { message: "You must choose a food" }),
});

export default function CustomDialogOrder({
  title,
  description,
  buttonTitle,
  action,
  foodId,
  id,
  note,
  batchId,
  quantity,
}: Props) {
  const [foods, setFoods] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const { data } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: note || "",
      foodId: foodId || "",
      quantity: quantity || 0,
    },
  });

  useEffect(() => {
    const fetchPetTypes = async () => {
      if (data?.jwt) {
        try {
          const response = await GetFoodsServices(data.jwt);
          setFoods(response.data);
        } catch (error) {
          console.error(error);
          ShowToast("Failed to fetch pet types", true);
        }
      }
    };
    fetchPetTypes();
  }, [data?.jwt]);

  useEffect(() => {
    // Reset form values when foods are updated or initial props change
    form.reset({
      note: note || "",
      foodId: foodId || (foods.length > 0 ? foods[0].documentId : ""),
      quantity: quantity || 0,
    });
  }, [note, foodId, foods, quantity, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (id) {
      const newData: CreateOrderType = {
        note: values.note,
        food: values.foodId,
        quantity: values.quantity,
        batch: batchId as string,
      };
      action(newData, id);
    } else {
      const newData: CreateOrderType = {
        note: values.note,
        food: values.foodId,
        quantity: values.quantity,
        batch: batchId as string,
      };
      action(newData);
    }

    setOpen(false);
  };

  const ViewFood = (food: any) => {
    return food ? `${food.name} - ${FormatCurrency(food.price)}` : null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonTitle}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Note (your name for generate):`}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter note..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="quantity..."
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foodId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mt-2.5">Food</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            {ViewFood(
                              foods.find(
                                (f: any) => f.documentId === field.value
                              )
                            ) || "Select Food"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Select Food</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                            className="max-h-[10rem] overflow-y-auto scrollbar-custom"
                          >
                            {foods.length > 0 ? (
                              foods.map((food: any) => (
                                <DropdownMenuRadioItem
                                  key={food.documentId}
                                  value={food.documentId}
                                >
                                  {ViewFood(food)}
                                </DropdownMenuRadioItem>
                              ))
                            ) : (
                              <div>No foods available</div>
                            )}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
