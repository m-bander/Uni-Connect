import AnnouncementForm from "@/components/forms/CourseForms/AnnouncementForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Announcement } from "@/types/student/announcement";
import { type QueryKey } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";

type EditAnnouncementButtonProps = {
  announcement: Announcement;
  queryKey?: QueryKey;
  announcementUri: string;
};

const EditAnnouncementButton = ({
  announcement,
  queryKey,
  announcementUri,
}: EditAnnouncementButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const defaultValues = {
    ...announcement,
    pollItems:
      "pollItems" in announcement
        ? announcement.pollItems.map((pollItem) => ({
            value: pollItem.content,
            id: pollItem.id,
          }))
        : undefined,
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="size-4" aria-label="Edit announcement" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Update announcement</DialogTitle>
        </DialogHeader>
        <AnnouncementForm
          onClose={() => setModalOpen(false)}
          announcementUri={announcementUri}
          queryKey={queryKey}
          announcementId={announcement.id}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAnnouncementButton;
