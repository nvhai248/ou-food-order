"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function SidebarAvatar() {
  const { data } = useSession();

  const defaultAvatar =
    "https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeGldwX2I_wuqHJyb4SmnbQ-Wt9TLzuBU1Ba31MvO4FTUDzaVfnCjkiur8mnKIoCxDEn8EpVvu75lOeSdJjeFkHC&_nc_ohc=pq3BCajqsBEQ7kNvgENERzD&_nc_zt=24&_nc_ht=scontent.fsgn5-12.fna&_nc_gid=A8IA_A9EgX5NFPBs9s_p3So&oh=00_AYBSdxmWOS-y2p56ExRWiQMxfOGMvjo704SdoXgFOHscVg&oe=6780A7FA";

  return (
    <div className="flex">
      <Avatar>
        <AvatarImage
          src={data?.user?.avatar?.url || defaultAvatar}
          alt="user-avatar"
        />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>

      <span className="ml-4 mt-[10px]">{data?.user?.email}</span>
    </div>
  );
}
