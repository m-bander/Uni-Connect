import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteAnnouncementButtonProps = {
  queryKey?: QueryKey;
  announcementUri: string;
};

const DeleteAnnouncementButton = ({
  queryKey,
  announcementUri,
}: DeleteAnnouncementButtonProps) => {
  // TODO: Put these in a custom hook
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        await api.delete(announcementUri);

        if (queryKey) queryClient.invalidateQueries({ queryKey });

        setModalOpen(false);
        toast.success("Announcement deleted successfully.");
      } catch (error) {
        console.error(error);
        toast.error(
          "An error occurred while deleting the announcement, please try again later."
        );
      }
    },
  });

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash aria-label="Delete Announcement" className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete announcement</DialogTitle>
          <DialogDescription>
            Are you sure that you want to delete this announcement.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? "Deleting" : "Delete"}
            {isPending && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAnnouncementButton;
