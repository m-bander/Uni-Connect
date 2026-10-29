import GradeSubmissionForm from "@/components/forms/CourseForms/GradeSubmissionForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Submission } from "@/types/student/submission";
import { format } from "date-fns";
import { useState } from "react";
import FileCard from "../common/course/assignments/FileCard";
import type { Assignment } from "@/types/student/assignment";

type SubmissionCardProps = {
  submission: Submission;
  assignment: Assignment;
};

export default function SubmissionCard({
  submission,
  assignment,
}: SubmissionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAssigningGrade, setIsAssigningGrade] = useState(false);

  return (
    <Card className="p-4">
      {/* Submitter Info */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={submission.submitter.image_url} />
          <AvatarFallback className="rounded-full capitalize">
            {`${submission.submitter.first_name?.[0] ?? "?"}${submission.submitter.parent_name?.[0] ?? ""}`}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h4 className="font-semibold text-foreground">
            {`${submission.submitter.first_name ?? ""} ${submission.submitter.parent_name ?? ""}`.trim()}
          </h4>
          <p className="text-sm text-muted-foreground">
            Submitted at{" "}
            {submission.turned_in_at
              ? format(new Date(submission.turned_in_at), "MMM d, yyyy h:mm a")
                  .replace("am", "AM")
                  .replace("pm", "PM")
              : "—"}
          </p>
        </div>
      </div>

      {/* Submission Attached Files */}
      <div className="space-y-2 mb-4">
        <p className="text-sm font-medium text-foreground">Files:</p>
        {submission.attached_files?.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            showDelete={false}
            showDownload={true}
            showView={true}
          />
        ))}
      </div>

      {typeof submission.grade === "number" ? (
        <div className="p-3 pt-0 bg-accent/5 rounded border border-accent/20 mb-3">
          <p className="text-sm font-medium text-foreground mb-1">
            Grade: {submission.grade}/{assignment.max_grade}
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            {submission.feedback}
          </p>

          {isEditing ? (
            <GradeSubmissionForm
              assignment={assignment}
              mode="edit"
              submissionId={submission.id}
              onClose={() => setIsEditing(false)}
              defaultValues={{
                grade: String(submission.grade),
                feedback: submission.feedback ?? undefined,
              }}
            />
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Grade
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          {isAssigningGrade ? (
            <GradeSubmissionForm
              assignment={assignment}
              mode="create"
              submissionId={submission.id}
              onClose={() => setIsAssigningGrade(false)}
            />
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAssigningGrade(true)}
            >
              Assign Grade
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
