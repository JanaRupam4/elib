import * as React from "react";
import { Book, BookImage, HomeIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookImage />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Ebook Store</span>
                  <span className="">Let's Read</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <div className="flex-1">
          <div className="grid items-center gap-y-4 px-2 text-sm font-medium lg:px-4 py-4">
            <Link
              to={"/dashboard/home"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-zinc-100"
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>{" "}
            <Link
              to={"/dashboard/books"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-zinc-100"
            >
              <Book className="h-4 w-4" />
              Books
            </Link>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
