import DataTable from "@/components/common/DataTable";
import { COURSES_TABLE_COLUMNS } from "@/constants/admin/courses-table";
import useAllCourses from "@/hooks/shared/use-all-courses";
import useTableQuery from "@/hooks/shared/use-table-query";

const AdminDashboard = () => {
  const {
    columnFilters,
    pagination,
    setColumnFilters,
    setPagination,
    setSorting,
    sorting,
  } = useTableQuery();

  const { allCourses, meta } = useAllCourses({
    ...pagination,
    sortingOptions: sorting.map((element) => ({
      ...element,
      attribute: element.id,
    })),
    filteringOptions: columnFilters.map((element) => ({
      ...element,
      attribute: element.id,
    })),
  });

  return (
    <DataTable
      searchColumnId="course_code"
      searchInputPlaceholder="Course code..."
      columns={COURSES_TABLE_COLUMNS}
      data={allCourses}
      columnFilters={columnFilters}
      pageCount={meta.totalPages}
      pagination={pagination}
      setColumnFilters={setColumnFilters}
      setPagination={setPagination}
      setSorting={setSorting}
      sorting={sorting}
    />
  );
};

export default AdminDashboard;
