import ViewProfileButton from "@/components/common/ViewProfileButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StudentUser } from "@/types/student/student-user";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export const COURSE_STUDENTS_DETAILS_TABLE_COLUMNS: ColumnDef<
  StudentUser & {
    total_messages: number;
    polls_voted: number;
    average_grade: number;
    assignments_submitted: number;
  }
>[] = [
  {
    id: "student_code",
    accessorKey: "studentCode",
    header: () => <div className="text-center">Student Code</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original.code}</div>;
    },
  },
  {
    id: "first_name",
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name
        {column.getIsSorted() === "asc" && <ArrowUp className="ms-2 size-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ms-2 size-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ms-2 size-4" />}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.original.first_name}</div>
      );
    },
  },
  {
    id: "parent_name",
    accessorKey: "secondName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Second Name
        {column.getIsSorted() === "asc" && <ArrowUp className="ms-2 size-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ms-2 size-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ms-2 size-4" />}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.parent_name}
        </div>
      );
    },
  },
  {
    id: "messages_in_course_group",
    accessorKey: "messagesCountInCourseGroup",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Messages in Course Group
        {column.getIsSorted() === "asc" && <ArrowUp className="ms-2 size-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ms-2 size-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ms-2 size-4" />}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.total_messages}
        </div>
      );
    },
  },
  {
    id: "polls_voted_in_course",
    accessorKey: "pollsVoted",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Polls Voted
        {column.getIsSorted() === "asc" && <ArrowUp className="ms-2 size-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ms-2 size-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ms-2 size-4" />}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.polls_voted}
        </div>
      );
    },
  },
  {
    id: "average_grade_in_course",
    accessorKey: "averageGrade",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Average Grade
        {column.getIsSorted() === "asc" && <ArrowUp className="ms-2 size-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ms-2 size-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ms-2 size-4" />}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div
          className={cn("text-center font-medium", {
            "italic text-gray-400":
              typeof row.original.average_grade !== "number",
          })}
        >
          {typeof row.original.average_grade === "number"
            ? row.original.average_grade
            : "Didn't receive any grades yet."}
        </div>
      );
    },
  },
  {
    id: "assignments_submitted_in_course",
    accessorKey: "assignmentsSubmitted",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Assignments Submitted
        {column.getIsSorted() === "asc" && <ArrowUp className="ms-2 size-4" />}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="ms-2 size-4" />
        )}
        {!column.getIsSorted() && <ArrowUpDown className="ms-2 size-4" />}
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.assignments_submitted}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ViewProfileButton profileId={row.original.id} />;
    },
  },
];
