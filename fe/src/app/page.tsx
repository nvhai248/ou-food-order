"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ShowToast } from "@/components/show-toast";
import { signIn, useSession } from "next-auth/react";
import { useLoading } from "@/providers/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FormSchema = z.object({
  identifier: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(1, {
    message: "Please enter the password.",
  }),
});

export default function Page() {
  const { setLoading }: any = useLoading();
  const { data, status } = useSession();
  const router = useRouter();

  // Effect to handle loading state and redirect
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(true);

      const timeout = setTimeout(() => {
        if (data?.user) {
          router.push("/batch");
        }
        setLoading(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [status, data, router, setLoading]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      ShowToast("Login fail, Try again!", true);
    } else {
      window.location.href = "/order";
    }

    setLoading(false);
  }

  return (
    <div className="relative h-screen">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-80">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Login</CardTitle>
            <CardDescription>
              Please login first and you can order late 🐖
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username or email..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
