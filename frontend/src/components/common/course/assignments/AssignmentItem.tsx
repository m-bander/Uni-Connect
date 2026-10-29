import { formatDistanceToNow, format } from "date-fns";
import { Link } from "react-router-dom";
import { useState } from "react";

// Components & Icons
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// import { Badge } from "@/components/ui/badge";
// import { useSubmissionData } from "@/hooks/student/use-submission-data";
// import type { Submission } from "@/types/student/submission";
import { useDeleteAssignment } from "@/hooks/student/use-delete-assignment";
import EditAssignmentModal from "../modals/EditAssignmentModal";
import { useGetRoleUrl } from "@/hooks/use-role-url";
import type { Assignment } from "@/types/student/assignment";

type AssignmentItemProps = {
  assignment: Assignment;
  allowModifyAssignments: boolean;
};

// const getStatus = (assignment: Assignment, submission?: Submission | null) => {
//   const deadline = new Date(assignment.deadline_at).getTime();
//   const now = Date.now();
//   const isToday =
//     new Date(deadline).toDateString() === new Date().toDateString();

//   if (now > deadline && (!submission || submission.status === "unsubmitted"))
//     return "Overdue";
//   if (submission?.status === "graded") return "Graded";
//   if (isToday) return "Due Today";
//   return "Due";
// };

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "due":
//       return "bg-blue-50 text-blue-600";
//     case "due today":
//       return "bg-amber-50 text-amber-600";
//     case "overdue":
//       return "bg-red-50 text-red-600";
//     case "submitted":
//       return "bg-green-50 text-green-600";
//     case "graded":
//       return "bg-slate-100 text-slate-600";
//     default:
//       return "bg-slate-100 text-slate-600";
//   }
// };

const formatDate = (assignment: Assignment) => {
  const uploadedAt = new Date(assignment.created_at);
  const now = new Date();
  const diffInMs = now.getTime() - uploadedAt.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 7) {
    return formatDistanceToNow(uploadedAt, { addSuffix: true });
  } else {
    return format(uploadedAt, "MMM d, h:mma");
  }
};

export default function AssignmentItem({
  assignment,
  allowModifyAssignments = false,
}: AssignmentItemProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  // TODO: I think this should be moved to the assignment list component for better performance
  const { deleteAssignment, isDeleting } = useDeleteAssignment(
    assignment.course_id,
    assignment.id
  );
  // const { submission } = useSubmissionData(assignment.id, assignment.course_id);
  const { getRoleUrl } = useGetRoleUrl();

  const handleDelete = async (assignmentId: string) => {
    try {
      setPendingDeleteId(assignmentId);
      await deleteAssignment();
    } finally {
      setPendingDeleteId(null);
    }
  };

  // const submissionStatus = getStatus(assignment, submission);
  const formattedDate = formatDate(assignment);

  return (
    <CardContent className="p-4 hover:bg-slate-100/70 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Assignment Content */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="font-medium text-slate-800 hover:text-blue-600 transition-colors truncate">
              <Link
                to={`/${getRoleUrl()}/courses/${assignment.course_id}/assignment/${assignment.id}`}
              >
                {assignment.title}
              </Link>
            </CardTitle>
            <p className="text-sm text-slate-500 mt-2 line-clamp-1">
              {assignment.description}
            </p>
            <CardDescription className="flex items-center gap-3 text-sm text-slate-500 mt-2 flex-wrap">
              {assignment.assigner && (
                <>
                  <span className="capitalize">
                    {`${assignment.assigner.first_name} ${assignment.assigner.parent_name}`}
                  </span>
                  <span>•</span>
                </>
              )}
              <span>
                Uploaded {assignment.created_at ? formattedDate : "-"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {assignment.deadline_at
                    ? format(
                        new Date(
                          Number(assignment.deadline_at) ||
                            assignment.deadline_at
                        ),
                        "MMM d, h:mma"
                      )
                    : "-"}
                </span>
              </span>
            </CardDescription>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* <Badge className={getStatusColor(submission?.status ?? "Due")}>
            {submissionStatus}
          </Badge> */}
          {allowModifyAssignments && (
            <>
              <EditAssignmentModal assignment={assignment} />

              {/* Delete Modal */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    disabled={isDeleting && pendingDeleteId === assignment.id}
                  >
                    {isDeleting && pendingDeleteId === assignment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this assignment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove
                      the assignment
                      <span className="font-semibold">
                        {" "}
                        "{assignment.title}"
                      </span>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      {isDeleting && pendingDeleteId === assignment.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Link
            to={`/${getRoleUrl()}/courses/${assignment.course_id}/assignment/${assignment.id}`}
          >
            <Button variant="ghost" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </CardContent>
  );
}
