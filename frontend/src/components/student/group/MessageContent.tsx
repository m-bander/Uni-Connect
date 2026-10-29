import { CardContent } from "@/components/ui/card";
import converToTimeWithAmPm from "@/utils/time/convert-to-time-am-pm";

type MessageContentProps = {
  content: string;
  created_at: string;
};

const MessageCotent = ({ content, created_at }: MessageContentProps) => {
  return (
    <CardContent className="flex flex-col px-3">
      <p>{content}</p>
      <span className="self-end text-xs text-gray-400">
        {converToTimeWithAmPm(new Date(created_at).getTime())}
      </span>
    </CardContent>
  );
};

export default MessageCotent;
