import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type MessageInputProps = {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  sendMessage: () => Promise<void>;
};

const MessageInput = ({
  message,
  setMessage,
  sendMessage,
}: MessageInputProps) => {
  return (
    <div className="relative mt-auto">
      <Textarea
        className="resize-none min-h-0"
        rows={1}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder="Type a message..."
      />

      <Button
        aria-label="Send message."
        disabled={message.trim() === ""}
        className="absolute top-1 end-1 rounded-full size-7"
        onClick={sendMessage}
      >
        <SendHorizonal />
      </Button>
    </div>
  );
};

export default MessageInput;
