import GroupHeader from "@/components/student/group/GroupHeader";
import MessageInput from "@/components/student/group/MessageInput";
import Messages from "@/components/student/group/Messages";
import { Card, CardContent } from "@/components/ui/card";
import useGroup from "@/hooks/student/use-group";
import { Navigate } from "react-router";
import { toast } from "sonner";
import notFoundAnimation from "@/assets/lottie/Error 404.json";
import CustomLottie from "@/components/global/CustomLottie";

const Group = () => {
  const {
    group,
    userId,
    message,
    messages,
    setMessage,
    sendMessage,
    authLoading,
    isLoadingMessages,
  } = useGroup();

  // TODO: Replace with 404 page
  if (!group && !isLoadingMessages)
    return (
      <CustomLottie
        message="Oops, this group doesn't exist."
        animationData={notFoundAnimation}
      />
    );

  // TODO: Replace with loading skeleton
  if (authLoading || isLoadingMessages || !group) return null;

  if (!userId) {
    toast("To access the group, you have to log in.");
    return <Navigate to={"/login"} />;
  }

  return (
    <Card className="h-full gap-0 pt-3">
      <GroupHeader image_url={group.image_url} name={group.name} />
      <CardContent className="flex flex-col h-full pt-3">
        <Messages groupId={group.id} messages={messages} userId={userId} />
        <MessageInput
          message={message}
          sendMessage={sendMessage}
          setMessage={setMessage}
        />
      </CardContent>
    </Card>
  );
};

export default Group;
