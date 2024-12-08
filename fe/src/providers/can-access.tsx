"use client";

import { ReactNode, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useLoading } from "./loading";
interface Props {
  children: ReactNode;
}

const CheckBeforeAccess = ({ children }: Props) => {
  const { setLoading }: any = useLoading();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(true);
      const timeout = setTimeout(() => {
        if (!session?.user) {
          signOut();
          window.location.href = "/";
        }

        setLoading(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [status, session, setLoading]);

  return children;
};

export default CheckBeforeAccess;
