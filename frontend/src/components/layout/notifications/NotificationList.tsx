import type { Notification as TNotification } from "@/types/student/notification";
import Notification from "./Notification";

type NotificationListProps = {
  notifications: TNotification[];
  markAllAsRead: () => void;
};

const NotificationList = ({ notifications }: NotificationListProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm leading-none font-medium">Notifications</h4>
      </div>
      {notifications.map((notification) => (
        <Notification notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;
