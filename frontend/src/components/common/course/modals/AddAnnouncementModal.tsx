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
import type { QueryKey } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

type AddAnnouncementModalProps = {
  courseCode: string;
  trigger?: React.ReactNode;
  queryKey?: QueryKey;
};

export default function AddAnnouncementModal({
  courseCode,
  trigger,
  queryKey,
}: AddAnnouncementModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          <>{trigger}</>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Announcement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-144">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>
            Share important announcements with your class.
          </DialogDescription>
        </DialogHeader>
        <AnnouncementForm
          announcementUri={`/api/courses/${courseCode}/announcements`}
          onClose={() => setOpen(false)}
          queryKey={queryKey}
        />
      </DialogContent>
    </Dialog>
  );
}
