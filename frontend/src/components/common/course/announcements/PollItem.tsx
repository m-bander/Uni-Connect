import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import usePollItem from "@/hooks/student/use-poll-item";
import { useAuth } from "@/providers/context/authContext";
import type { PollItem as TPollItem } from "@/types/student/announcement";

type PollItemProps = {
  courseStudentsCount: number;
  pollItem: TPollItem;
};

const PollItem = ({ courseStudentsCount, pollItem }: PollItemProps) => {
  const { pollItemChecked, toggleVote } = usePollItem(pollItem);
  const { auth } = useAuth();

  if (!auth) return null;

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={`poll-item-${pollItem.id}`}
        className="size-5"
        checked={pollItemChecked}
        onCheckedChange={() => toggleVote()}
        disabled={auth.user?.role === "professor/ta"}
      />
      <div className="flex flex-col grow">
        <div className="flex justify-between items-center">
          <Label htmlFor={`poll-item-${pollItem.id}`} className="text-lg">
            {pollItem.content}
          </Label>
          <span>{pollItem.votersIds.length}</span>
        </div>
        <Progress
          value={(pollItem.votersIds.length * 100) / courseStudentsCount}
        />
      </div>
    </div>
  );
};

export default PollItem;
