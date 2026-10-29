import SubmissionsTableDropdownMenu from "@/components/instructor/submissions/SubmissionsTableDropdownMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Assignment } from "@/types/student/assignment";
import type { Submission } from "@/types/student/submission";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const SUBMISSIONS_TABLE_COLUMNS: ColumnDef<{
  submission: Submission;
  assignment: Assignment;
}>[] = [
  {
    id: "student_code",
    accessorKey: "studentCode",
    header: () => <div className="text-center">Student Code</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.submission.submitter.code}
        </div>
      );
    },
  },
  {
    id: "first_name",
    accessorKey: "firstName",
    header: () => <div className="text-center">First Name</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.submission.submitter.first_name}
        </div>
      );
    },
  },
  {
    id: "parent_name",
    accessorKey: "secondName",
    header: () => <div className="text-center">Second Name</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.submission.submitter.parent_name}
        </div>
      );
    },
  },
  {
    id: "turned_in_at",
    accessorKey: "submissionDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submission Date
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className={cn(`text-center font-medium`, {
            "text-gray-400 italic": !row.original.submission.turned_in_at,
          })}
        >
          {row.original.submission.turned_in_at
            ? new Date(row.original.submission.turned_in_at).toLocaleString()
            : "Not submitted"}
        </div>
      );
    },
  },
  {
    accessorKey: "submission_status",
    header: () => <div className="text-center">Submission Status</div>,
    cell: ({ row }) => {
      let status = "";
      let textClassName = "";

      if (!row.original.submission.turned_in_at) {
        if (
          new Date().getTime() <
          new Date(row.original.assignment.deadline_at).getTime()
        ) {
          status = "Not delivered yet";
          textClassName = "text-gray-400";
        } else {
          status = "Missed deadline (didn't submit yet)";
          textClassName = "text-red-400";
        }
      } else {
        if (
          new Date(row.original.submission.turned_in_at).getTime() <
          new Date(row.original.assignment.deadline_at).getTime()
        ) {
          status = "Delivered on time";
          textClassName = "text-green-600";
        } else {
          status = "Submitted after deadline";
          textClassName = "text-yellow-400";
        }
      }

      return (
        <div className={`text-center font-medium ${textClassName}`}>
          {status}
        </div>
      );
    },
  },
  {
    id: "grade",
    accessorKey: "grade",
    header: () => <div className="text-center">Grade</div>,
    cell: ({ row }) => {
      return (
        <div
          className={cn("text-center", {
            "italic text-gray-400":
              typeof row.original.submission.grade !== "number",
          })}
        >
          {typeof row.original.submission.grade === "number"
            ? row.original.submission.grade
            : "Not graded yet"}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <SubmissionsTableDropdownMenu
          submission={row.original.submission}
          assignment={row.original.assignment}
        />
      );
    },
  },
];
