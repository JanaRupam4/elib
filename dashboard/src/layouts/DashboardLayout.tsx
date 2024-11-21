import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useToken from "@/store";
import { Navigate, Outlet } from "react-router-dom";

export function DashboardLayout() {
  const token = useToken((state) => state.token);
  if(token === ""){
    return <Navigate to={"/auth/login"} replace/>
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-screen">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
