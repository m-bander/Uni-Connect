import useTableQuery from "@/hooks/shared/use-table-query";
import DataTable from "../common/DataTable";
import { COURSE_STUDENTS_DETAILS_TABLE_COLUMNS } from "@/constants/instructor/course-students-details-table";
import useCourseMembers from "@/hooks/shared/use-course-members";
import { useParams } from "react-router";

const CourseStudentsDetailsTable = () => {
  const {
    columnFilters,
    pagination,
    setColumnFilters,
    setPagination,
    setSorting,
    sorting,
  } = useTableQuery();

  const { id } = useParams();

  const { courseMembers, meta } = useCourseMembers(id, {
    filteringOptions: columnFilters.map((element) => ({
      ...element,
      attribute: element.id,
    })),
    sortingOptions: sorting.map((element) => ({
      ...element,
      attribute: element.id,
    })),
    ...pagination,
  });

  // TODO: Add loading skeleton

  return (
    <DataTable
      columnFilters={columnFilters}
      columns={COURSE_STUDENTS_DETAILS_TABLE_COLUMNS}
      data={courseMembers.students}
      pageCount={meta.totalPages}
      pagination={pagination}
      searchColumnId="student_code"
      searchInputPlaceholder="Search by student code..."
      setColumnFilters={setColumnFilters}
      setPagination={setPagination}
      setSorting={setSorting}
      sorting={sorting}
    />
  );
};

export default CourseStudentsDetailsTable;
