import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Refreshed = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("refreshed", Date.now().toString());
    router.replace(`?${params.toString()}`);
  }, [router, searchParams]);

  return null;
};

export default Refreshed;
