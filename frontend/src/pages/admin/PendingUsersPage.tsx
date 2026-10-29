import { useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { UserCard } from "@/components/admin/UserCard";
import { useGetUsers } from "@/hooks/admin/use-get-users";

const PendingUsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const perPage = 10;

  // Get values from URL search params
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Update URL search params
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 when filters change
    if (updates.page === undefined) {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };
  
  const { users, totalPages, isLoadingUsers } = useGetUsers({
    page,
    perPage,
    search: search || undefined,
    roleFilter: "professor/ta",
    yearFilter: "all",
    pendingOnly: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Pending Users</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search pending users..." 
              value={search} 
              onChange={(e) => { 
                updateSearchParams({ search: e.target.value || null }); 
              }} 
              className="pl-10" 
            />
          </div>
        </div>

        <AdminPagination 
          page={page} 
          totalPages={totalPages} 
          onPageChange={(newPage) => updateSearchParams({ page: newPage.toString() })} 
        />

        {isLoadingUsers ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {users.map((user) => (
                <UserCard key={user.id} user={user} userType="pending"/>
              ))}
            </div>
            {users.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No pending users found.</p>
            )}
          </>
        )}

        <AdminPagination 
          page={page} 
          totalPages={totalPages} 
          onPageChange={(newPage) => updateSearchParams({ page: newPage.toString() })} 
        />
      </div>
    </div>
  );
};

export default PendingUsersPage;
