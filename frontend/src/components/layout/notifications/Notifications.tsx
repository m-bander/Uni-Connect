import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import useNotifications from "@/hooks/student/use-notifications";
import BellAndIndicator from "./BellAndIndicator";
import NotificationList from "./NotificationList";
import { useStudentCourses } from "@/hooks/student/use-student-courses";

const Notifications = () => {
  const { courses } = useStudentCourses();
  const { markAllAsRead, notifications, unreadNotificationsCount } =
    useNotifications(courses);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" onClick={markAllAsRead}>
          <BellAndIndicator
            unreadNotificationsCount={unreadNotificationsCount}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <ScrollArea className="h-72 w-96 rounded-md border">
          <NotificationList
            markAllAsRead={markAllAsRead}
            notifications={notifications}
          />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
