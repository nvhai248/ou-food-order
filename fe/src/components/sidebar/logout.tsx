"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export default function LogoutSidebar() {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <Button
      variant="outline"
      className="w-full text-start"
      onClick={handleSignOut}
    >
      <LogOut />
      <span>Sign out</span>
    </Button>
  );
}
