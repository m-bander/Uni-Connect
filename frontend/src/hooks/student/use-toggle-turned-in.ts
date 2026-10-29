import api from "@/lib/axios";
import type { Submission } from "@/types/student/submission";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UseToggleTurnedInArgs = {
  submission: Submission | undefined | null;
  courseId: string;
};

const useToggleTurnedIn = ({ submission, courseId }: UseToggleTurnedInArgs) => {
  const queryClient = useQueryClient();

  const { mutateAsync: toggleTurnedIn, isPending: isTogglingTurnedIn } =
    useMutation({
      mutationKey: [
        "toggle-turned-in",
        submission?.is_turned_in,
        submission?.id,
      ],
      mutationFn: async () => {
        if (!submission)
          throw new Error(
            "Can't toggle is_turned_in without while submission is undefined"
          );
        return api.patch(
          `/api/courses/${courseId}/assignments/${submission.assignment_id}/submissions/${submission.id}`,
          {
            is_turned_in: !submission.is_turned_in,
          }
        );
      },
      onSuccess: () => {
        if (!submission)
          throw new Error(
            "Can't toggle is_turned_in without while submission is undefined"
          );

        toast.success(
          `Submission has been turned ${submission.is_turned_in ? "out" : "in"} successfully.`
        );
        queryClient.invalidateQueries({
          queryKey: ["student-submission", submission.assignment_id],
        });
      },
      onError: (error) => {
        console.error(error);

        toast.error(
          `An error occurred while turning ${submission?.is_turned_in ? "in" : "out"} this submission. Please try again.`
        );
      },
    });

  return {
    toggleTurnedIn,
    isTogglingTurnedIn,
  };
};

export default useToggleTurnedIn;
