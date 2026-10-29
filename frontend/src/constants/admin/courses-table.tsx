import Teachers from "@/components/student/dashboard/Teachers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/student/course";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const COURSES_TABLE_COLUMNS: ColumnDef<Course>[] = [
  {
    id: "course_code",
    accessorKey: "courseCode",
    header: () => <div className="text-center">Course Code</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original.code}</div>;
    },
  },
  {
    id: "instructors",
    accessorKey: "instructors",
    header: () => <div className="text-center">Instructors</div>,
    cell: ({ row }) => {
      return (
        <div
          className={cn("text-center font-medium", {
            "italic text-gray-400": row.original.teachers.length === 0,
          })}
        >
          {row.original.teachers.length > 0 ? (
            <Teachers teachers={row.original.teachers} />
          ) : (
            "No instructors assigned."
          )}
        </div>
      );
    },
  },
  {
    id: "heads",
    accessorKey: "heads",
    header: () => <div className="text-center">Course Heads</div>,
    cell: ({ row }) => {
      return (
        <div
          className={cn("text-center font-medium", {
            "italic text-gray-400": row.original.representatives.length === 0,
          })}
        >
          {row.original.representatives.length > 0
            ? row.original.representatives
                .map((rep) => `${rep.first_name} ${rep.parent_name}`)
                .join(", ")
            : "No heads assigned."}
        </div>
      );
    },
  },
  {
    id: "students_count",
    accessorKey: "totalStudents",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Enrolled Students
        <ArrowUpDown className="ms-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div
          className={cn("text-center font-medium", {
            "italic text-gray-400": row.original.students_number === 0,
          })}
        >
          {row.original.students_number > 0
            ? row.original.students_number
            : "No students enrolled."}
        </div>
      );
    },
  },
];
