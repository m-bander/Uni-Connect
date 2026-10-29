import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { type Notification as TNotification } from "@/types/student/notification";
import converToTimeWithAmPm from "@/utils/time/convert-to-time-am-pm";
import { isToday } from "date-fns/isToday";
import { Calendar, Megaphone } from "lucide-react";

type NotificationProps = {
  notification: TNotification;
};

const Notification = ({
  notification: { content, source, created_at, title, marked_as_read },
}: NotificationProps) => {
  return (
    <Item variant="outline" className="mb-2">
      <ItemMedia variant="icon">
        {source === "announcement" && <Megaphone />}
        {source === "calendar_event" && <Calendar />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="flex justify-between w-full">
          {title}
          {!marked_as_read && (
            <Badge variant="default" className="ms-auto">
              Unread
            </Badge>
          )}
        </ItemTitle>
        <ItemDescription className="block">{content}</ItemDescription>
      </ItemContent>
      <ItemFooter className="ms-auto self-end">
        {isToday(created_at)
          ? converToTimeWithAmPm(new Date(created_at).getTime())
          : new Date(created_at).toDateString()}
      </ItemFooter>
    </Item>
  );
};

export default Notification;
