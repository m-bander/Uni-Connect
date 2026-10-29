import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Message as TMessage } from "@/types/student/message";
import MessageActions from "./MessageActions";
import MessageAvatar from "./MessageAvatar";
import MessageCotent from "./MessageContent";
import styles from "./styles.module.css";

type MessageProps = {
  message: TMessage;
  showSender?: boolean;
  className?: string;
  groupId: string;
  position?: "start" | "end";
  showMessageActions?: boolean;
};

const Message = ({
  message,
  showSender,
  className,
  position = "start",
  showMessageActions = false,
  groupId,
}: MessageProps) => {
  const { content, created_at, sender } = message;

  return (
    <div
      className={cn(`grid gap-3 w-fit ${styles.messageGroup}`, className, {
        "w-fit ms-auto": position === "end",
      })}
    >
      {showSender && position !== "end" && <MessageAvatar sender={sender} />}

      <Card
        className={`max-w-xs min-w-36 rounded-2xl gap-2 py-3 ${styles.content}`}
      >
        <CardHeader className="px-3 flex items-center justify-between">
          {showSender && (
            <CardTitle className="text-primary">{`${sender.first_name} ${sender.parent_name}`}</CardTitle>
          )}
          {showMessageActions && (
            <MessageActions groupId={groupId} message={message} />
          )}
        </CardHeader>

        <MessageCotent content={content} created_at={created_at} />
      </Card>
    </div>
  );
};

export default Message;
