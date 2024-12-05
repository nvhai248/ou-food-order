"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function SidebarAvatar() {
  const { data } = useSession();

  const defaultAvatar =
    "https://scontent.fhan4-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeGldwX2I_wuqHJyb4SmnbQ-Wt9TLzuBU1Ba31MvO4FTUDzaVfnCjkiur8mnKIoCxDEn8EpVvu75lOeSdJjeFkHC&_nc_ohc=HtQaFFdxl5gQ7kNvgGLGXHl&_nc_zt=24&_nc_ht=scontent.fhan4-2.fna&_nc_gid=AslA7YO-GS9eX7CDrKSw5lS&oh=00_AYBXEo0szmYpmxKCOIqrKt-_o_bFggklbldNwzwx49aD8w&oe=674FE07A";

  return (
    <div className="flex">
      <Avatar>
        <AvatarImage
          src={data?.user?.avatarUrl || defaultAvatar}
          alt="@shadcn"
        />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>

      <span className="ml-4 mt-[10px]">{data?.user?.email}</span>
    </div>
  );
}
