import { useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { UserCard } from "@/components/admin/UserCard";
import { CreateUserModal } from "@/components/admin/CreateUserModal";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useGetUsers } from "@/hooks/admin/use-get-users";
import type { serverRolesType } from "@/types/api/auth";

const ROLES: { value: serverRolesType | "all"; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "student", label: "Student" },
  { value: "professor/ta", label: "Instructor" },
  { value: "class_representative", label: "Class Rep" },
  { value: "course_head", label: "Course Head" },
];

export const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const perPage = 10;

  // Get values from URL search params
  const search = searchParams.get("search") || "";
  const roleFilter = (searchParams.get("role") as serverRolesType | "all") || "all";
  const yearFilter = searchParams.get("year") || "all";
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
    roleFilter: roleFilter !== "all" ? roleFilter : undefined,
    yearFilter: yearFilter !== "all" ? yearFilter : undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Users</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                value={search} 
                onChange={(e) => { 
                  updateSearchParams({ search: e.target.value || null }); 
                }} 
                className="pl-10" 
              />
            </div>
            <Select 
              value={roleFilter} 
              onValueChange={(v) => { 
                updateSearchParams({ role: v !== "all" ? v : null }); 
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(r => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={yearFilter} 
              onValueChange={(v) => { 
                updateSearchParams({ year: v !== "all" ? v : null }); 
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {["1","2","3","4","5"].map(y => (
                  <SelectItem key={y} value={y}>Year {y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Create User Modal */}
          <CreateUserModal />
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
                <UserCard key={user.id} user={user} userType="user"/>
              ))}
            </div>
            {users.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No users found.</p>
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

export default UsersPage;