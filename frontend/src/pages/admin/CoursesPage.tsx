import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { CourseCard } from "@/components/admin/CourseCard";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { CreateCourseModal } from "@/components/instructor/CreateCourseModal";
import { Button } from "@/components/ui/button";
import useGetAllCourses from "@/hooks/admin/use-get-all-courses";
import type { Course } from "@/types/student/course";

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const perPage = 10;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 when filters change (except when changing page)
    if (updates.page === undefined) {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  const { courses, totalPages, isLoading } = useGetAllCourses({ page, perPage, search: search || undefined });
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Courses</h1>

          <CreateCourseModal
            trigger={
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Course
              </Button>
            }
          />
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              updateSearchParams({ search: e.target.value || null });
            }}
            className="pl-10"
          />
        </div>

        <AdminPagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => updateSearchParams({ page: newPage.toString() })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : (courses &&
            courses.map((course: Course) => (
              <CourseCard key={course.code} course={course} />
            ))
          )}
        </div>

        {courses && courses.length === 0 && (
          // TODO: Skeleton Loader / Spinner
          <p className="text-center text-muted-foreground py-8">
            No courses found. 
          </p>
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

export default CoursesPage;