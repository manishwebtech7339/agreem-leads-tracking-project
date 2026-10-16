import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardStatsQuery } from "@/store/rtk/dashboardApi";

const Home = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const stats = data?.data;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-medium">Welcome to Leads Tracking</h1>
        <p>Manage your leads, notes and users from one place.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="gap-1">
            <p className="text-muted-foreground">Total Leads</p>
            {isLoading ? (
              <Skeleton className="h-9 w-20 my-0.5" />
            ) : (
              <p className="text-3xl font-semibold">{stats?.totalLeads ?? 0}</p>
            )}
            <p>All registered leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="gap-1">
            <p className="text-muted-foreground">New Leads</p>
            {isLoading ? (
              <Skeleton className="h-9 w-20 my-0.5" />
            ) : (
              <p className="text-3xl font-semibold">{stats?.newLeads ?? 0}</p>
            )}
            <p>Awaiting follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="gap-1">
            <p className="text-muted-foreground">Converted Leads</p>
            {isLoading ? (
              <Skeleton className="h-9 w-20 my-0.5" />
            ) : (
              <p className="text-3xl font-semibold">
                {stats?.convertedLeads ?? 0}
              </p>
            )}
            <p>Successfully converted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="gap-1">
            <p className="text-muted-foreground">Total Users</p>
            {isLoading ? (
              <Skeleton className="h-9 w-20 my-0.5" />
            ) : (
              <p className="text-3xl font-semibold">{stats?.totalUsers ?? 0}</p>
            )}
            <p>Registered team members</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
