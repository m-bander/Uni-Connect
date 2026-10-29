import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types/student/announcement";
import type { QueryKey } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import DeleteAnnouncementButton from "../../announcement/DeleteAnnouncementButton";
import EditAnnouncementButton from "../../announcement/EditAnnouncementButton";
import PollItem from "./PollItem";

type AnnouncementCardProps = {
  announcement: Announcement;
  allowModifyAnnouncements: boolean;
  courseStudentsCount: number;
  className?: string;
  queryKey?: QueryKey;
  announcementUri: string;
};

export default function AnnouncementCard({
  announcement,
  allowModifyAnnouncements,
  courseStudentsCount,
  className,
  queryKey,
  announcementUri,
}: AnnouncementCardProps) {
  const createdAt = new Date(announcement.created_at);
  const now = new Date();
  const diffInMs = now.getTime() - createdAt.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  let formattedDate: string;
  if (diffInDays < 7) {
    formattedDate = formatDistanceToNow(createdAt, { addSuffix: true });
  } else {
    formattedDate = format(createdAt, "MMM d, h:mma");
  }

  return (
    <Card className={cn("p-6", className)}>
      <CardHeader className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 rounded-full">
              <AvatarImage src={announcement.announcer.image_url} />
              <AvatarFallback className="rounded-full capitalize">{`${announcement.announcer.first_name[0]}${announcement.announcer.parent_name[0]}`}</AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="font-semibold text-slate-800">
                {announcement.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                {`${announcement.announcer.first_name} ${announcement.announcer.parent_name}`}{" "}
                • {formattedDate}
              </CardDescription>
            </div>
          </div>
          {allowModifyAnnouncements && (
            <div className="flex items-center gap-2">
              <EditAnnouncementButton
                announcement={announcement}
                queryKey={queryKey}
                announcementUri={announcementUri}
              />
              <DeleteAnnouncementButton
                queryKey={queryKey}
                announcementUri={announcementUri}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {announcement.content}

        {announcement.type === "poll" && (
          <CardContent className="space-y-6 mt-3">
            {announcement.pollItems.map((pollItem) => (
              <PollItem
                pollItem={pollItem}
                courseStudentsCount={courseStudentsCount}
              />
            ))}
          </CardContent>
        )}
      </CardContent>
    </Card>
  );
}
