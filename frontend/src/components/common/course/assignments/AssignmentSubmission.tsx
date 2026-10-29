import DOMPurify from "dompurify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAssignmentData } from "@/hooks/student/use-assignment-data";
import { useSubmissionData } from "@/hooks/student/use-submission-data";
import notFoundAnimation from "@/assets/lottie/Error 404.json";
import CustomLottie from "@/components/global/CustomLottie";
import { format, isFuture } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import downloadFromLink from "@/utils/files/downloadFile";
import StudentSubmissionModal from "./StudentSubmissionModal";
import { useGetRoleUrl } from "@/hooks/use-role-url";
import { useStudentSubmissions } from "@/hooks/student/use-student-submissions";
import GradeSubmissionModal from "../modals/GradeSubmissionModal";

// TODO: Clean this up
export default function AssignmentSubmission() {
  const { assignmentId, id: courseId } = useParams();

  const { assignment, isLoading: assignmentLoading } = useAssignmentData(
    assignmentId,
    courseId
  );

  const { submission } = useSubmissionData(assignmentId, courseId);
  const { submissionsAndMetadata } = useStudentSubmissions({
    assignmentId,
    courseId,
  });

  const submissions = submissionsAndMetadata.data;

  const { getRoleUrl } = useGetRoleUrl();
  const userRole = getRoleUrl();

  if (assignmentLoading) {
    return <></>; // TODO: Loading Skeleton / Lottie react loading
  }

  if (!assignmentId || !assignment) {
    return (
      <CustomLottie
        message="Oops, this assignment doesn't exist."
        animationData={notFoundAnimation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div
          className={
            userRole === "instructor"
              ? "max-w-4xl mx-auto space-y-6"
              : "grid lg:grid-cols-3 gap-8"
          }
        >
          {/* Left column - Assignment content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start justify-between">
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  {assignment.title}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  {assignment.assigner && (
                    <>
                      <span>{`${assignment.assigner.first_name} ${assignment.assigner.parent_name}`}</span>
                      <span>•</span>
                    </>
                  )}

                  <span>
                    Posted{" "}
                    {format(new Date(assignment.created_at), "MMM d, yyyy")}
                  </span>
                  <span>•</span>
                  <span
                    className={cn("font-medium", {
                      "text-primary": isFuture(
                        new Date(assignment.deadline_at)
                      ),
                      "text-destructive": !isFuture(
                        new Date(assignment.deadline_at)
                      ),
                    })}
                  >
                    Due {format(new Date(assignment.deadline_at), "yyyy-MM-dd")}
                  </span>
                </div>
              </div>

              {/* View Submissions (DIALOG BELOW) */}
              {userRole === "instructor" && (
                <GradeSubmissionModal
                  submissions={submissions}
                  assignment={assignment}
                />
              )}
            </div>

            {/* Description */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground">Description</h3>
              <div
                className="prose prose-sm max-w-none text-slate-700"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(assignment.description ?? ""),
                }}
              />

              {/* Attached Files */}
              {assignment.attached_files &&
                assignment.attached_files.length > 0 && (
                  <>
                    <Separator />
                    <h3 className="font-semibold text-foreground">
                      Attached Files
                    </h3>
                    <div className="space-y-3">
                      {assignment.attached_files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium text-gray-800">
                                {file.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {file.type} • {file.size}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              downloadFromLink(file.url, file.name)
                            }
                          >
                            <Download
                              className="size-4"
                              aria-label="Download file"
                            />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
            </Card>
          </div>

          {/* Right column - Submission box */}
          {userRole !== "instructor" && (
            <div className="space-y-6">
              <StudentSubmissionModal
                assignment={assignment}
                submission={submission}
              />
              {submission?.feedback && (
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground">Feedback</h3>
                  <div
                    className="prose prose-sm max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(submission.feedback ?? ""),
                    }}
                  />
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
