import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import CheckBeforeAccess from "@/providers/can-access";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CheckBeforeAccess>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </CheckBeforeAccess>
  );
}
