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
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, LogOut, Table2, User, Users } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { clearAuth } from "@/store/slices/authSlice";
import { useGetCurrentUserQuery } from "@/store/rtk/usersApi";
import { cn } from "cn";

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
  const location = useLocation();

  const { data: currentUserRes, isLoading: isUserLoading } =
    useGetCurrentUserQuery();
  const currentUser = currentUserRes?.data;

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/sign-in");
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <div className="text-center max-h-[46.5px] overflow-hidden">
          <h1 className="text-xl font-semibold">Agreem Tech</h1>
          <p className="text-sm text-muted-foreground">Leads Traking</p>
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
                  className={cn(
                    "flex items-center justify-between",
                    item.url === location.pathname &&
                      "bg-primary! text-primary-foreground!",
                  )}
                >
                  <span>{item.title}</span>
                  {item.icon}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2 space-y-2">
        {isUserLoading ? (
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="size-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="h-3 w-20 rounded bg-muted animate-pulse" />
              <div className="h-2.5 w-28 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ) : currentUser ? (
          <div className="flex items-center gap-2.5 rounded-md border border-border/60 bg-sidebar-accent/50 px-2.5 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs uppercase shadow-xs">
              {currentUser.name
                ? currentUser.name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                : <User className="size-4" />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col text-left">
              <span className="truncate text-xs font-semibold leading-tight text-sidebar-foreground">
                {currentUser.name}
              </span>
              <span className="truncate text-[11px] leading-tight text-muted-foreground">
                {currentUser.email}
              </span>
              {currentUser.gender && (
                <span className="text-[10px] text-muted-foreground/80 capitalize">
                  {currentUser.gender}
                </span>
              )}
            </div>
          </div>
        ) : null}

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
