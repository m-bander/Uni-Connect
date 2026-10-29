import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "./Message";
import type { Message as TMessage } from "@/types/student/message";

type MessagesProps = {
  messages: TMessage[];
  userId: string;
  groupId: string;
};

const Messages = ({ messages, groupId, userId }: MessagesProps) => {
  return (
    <div className="relative h-full">
      <ScrollArea className="space-y-2 mb-3 max-h-full h-full absolute! inset-0">
        {messages.map((message, index) => {
          const currentUserIsNotSender = message.sender.id !== userId;
          const isFirstMessage = index === 0;
          const senderOfCurrentMessageIsNotTheSenderOfThePrevious =
            messages.at(index - 1)?.sender.id !== message.sender.id;

          return (
            <Message
              groupId={groupId}
              className="mb-2"
              message={message}
              key={message.id}
              showSender={
                currentUserIsNotSender &&
                (isFirstMessage ||
                  senderOfCurrentMessageIsNotTheSenderOfThePrevious)
              }
              position={message.sender.id === userId ? "end" : "start"}
              showMessageActions={message.sender.id === userId}
            />
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default Messages;
