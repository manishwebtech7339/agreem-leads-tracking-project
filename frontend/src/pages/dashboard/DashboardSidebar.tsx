import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, LogOut, Table2, Users } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { clearAuth } from "@/store/slices/authSlice";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/sign-in");
  };

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
      <SidebarFooter className="border-t p-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            className="flex items-center justify-between text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <span>Logout</span>
            <LogOut />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
