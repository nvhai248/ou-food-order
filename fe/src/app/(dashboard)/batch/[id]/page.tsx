"use client";

import { useSession } from "next-auth/react";

export default function OrderPage() {
  const { data } = useSession();

  console.log(data?.user?.avatar?.url);

  return <h1> Em iu </h1>;
}
