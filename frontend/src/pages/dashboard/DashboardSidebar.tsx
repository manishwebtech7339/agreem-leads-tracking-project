import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { Home, Table2, Users } from "lucide-react";

// Routes
const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: <Home />,
    },
    {
      title: "Leads",
      url: "/dashboard/leads",
      icon: <Table2 />,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: <Users />,
    },
  ],
};

const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <div className="text-center max-h-[46.5px] overflow-hidden">
          <h1 className="text-xl font-semibold">Lorem Lipsum</h1>
          <p className="text-sm">Leads Traking</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* We create a SidebarGroup for each parent. */}
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className={"flex items-center justify-between"}
                >
                  <span>{item.title}</span>
                  {item.icon}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
