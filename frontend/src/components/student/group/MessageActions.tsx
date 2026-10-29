import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, Pen, Trash } from "lucide-react";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types/student/message";
import { useModal } from "@/providers/context/modalContext";

type MessageActionsProps = {
  groupId: string;
  message: Message;
};

const MessageActions = ({ groupId, message }: MessageActionsProps) => {
  const { setOpen } = useModal();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="ms-auto">
          <MoreVertical aria-label="Actions" size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" asChild>
        <ScrollArea className="h-22 w-44 rounded-md border p-1">
          <Button
            className="w-full justify-start"
            variant="ghost"
            onClick={() =>
              setOpen(<UpdateModal message={message} groupId={groupId} />)
            }
          >
            <Pen />
            Edit Message
          </Button>
          <Button
            className="w-full hover:bg-red-400/80 justify-start"
            variant="ghost"
            onClick={() =>
              setOpen(<DeleteModal groupId={groupId} messageId={message.id} />)
            }
          >
            <Trash />
            Delete Message
          </Button>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default MessageActions;
