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

interface Props {
  title: string;
  description: string;
  buttonTitle: React.ReactNode;
  action: any;
  open: boolean;
  id?: string;
  batchId?: string;
  quantity?: number;
  note?: string;
  setOpen: (isOpen: boolean) => void;
}

const formSchema = z.object({
  note: z.string().min(1, { message: "You must enter a note!" }),
  quantity: z.number().min(1, { message: "You must enter a quantity!" }),
  foodId: z.string().min(1, { message: "You must choose a food" }),
});

export default function CustomDialogOrderClassify({
  title,
  description,
  buttonTitle,
  action,
  id,
  note,
  batchId,
  quantity,
  open,
  setOpen,
}: Props) {
  const [foods, setFoods] = useState<any>([]);
  const { data } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: note || "",
      foodId: "",
      quantity: quantity || 0,
    },
  });

  useEffect(() => {
    const fetchPetTypes = async () => {
      if (data?.jwt) {
        try {
          const foods = await GetFoodsServices(data.jwt);
          setFoods(foods);
        } catch (error) {
          console.error(error);
          ShowToast("Failed to fetch pet types", true);
        }
      }
    };
    fetchPetTypes();
  }, [data?.jwt]);

  useEffect(() => {
    form.reset({
      note: note || "",
      foodId: foods[0]?.documentId as string | "",
      quantity: 0,
    });
  }, [note, foods, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (id) {
      action(values, id);
    } else {
      action(values);
    }
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
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="quantity..." {...field} />
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
                  <FormLabel className="mt-5">Pet Type</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {foods.find((f: any) => f.documentId === field.value)
                            ?.name || "Select Pet Type"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Select a Pet Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          {foods.map((food: any) => (
                            <DropdownMenuRadioItem
                              key={food.documentId}
                              value={food.documentId}
                            >
                              {food.name}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
