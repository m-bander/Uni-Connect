import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import styles from "./styles.module.css";
import type { StudentUser } from "@/types/student/student-user";

type MessageAvatarProps = {
  sender: StudentUser;
};

const MessageAvatar = ({ sender }: MessageAvatarProps) => {
  const firstLetterInFirstName = sender.first_name.at(0) ?? "";
  const firstLetterInSecondName = sender.parent_name.at(0) ?? "";

  return (
    <Avatar className={styles.avatar}>
      <AvatarImage src={sender.image_url} />
      <AvatarFallback>
        {firstLetterInFirstName + firstLetterInSecondName}
      </AvatarFallback>
    </Avatar>
  );
};

export default MessageAvatar;
