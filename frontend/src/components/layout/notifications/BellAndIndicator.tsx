import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

type BellAndIndicatorProps = {
  unreadNotificationsCount: number;
};

const BellAndIndicator = ({
  unreadNotificationsCount,
}: BellAndIndicatorProps) => {
  return (
    <div className="relative">
      {unreadNotificationsCount > 0 && (
        <Badge
          className="absolute -end-2.5 -top-2 h-5 min-w-5 rounded-full px-1 tabular-nums"
          variant="default"
        >
          {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
        </Badge>
      )}
      <Bell aria-label="Notifications" className="size-6" />
    </div>
  );
};

export default BellAndIndicator;
