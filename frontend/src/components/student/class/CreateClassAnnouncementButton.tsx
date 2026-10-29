import AnnouncementForm from "@/components/forms/CourseForms/AnnouncementForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/context/authContext";
import type { QueryKey } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { useState } from "react";

type CreateClassAnnouncementButtonProps = {
  queryKey: QueryKey;
};

const CreateClassAnnouncementButton = ({
  queryKey,
}: CreateClassAnnouncementButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { auth } = useAuth();

  if (!auth.user) return;

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <Megaphone />
          Create Class Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create class announcement</DialogTitle>
          <DialogDescription>
            Announce something to the class you represent.
          </DialogDescription>
        </DialogHeader>
        <AnnouncementForm
          queryKey={queryKey}
          announcementUri={`/api/years/${auth.user.year}/announcements`}
          onClose={() => setModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassAnnouncementButton;
