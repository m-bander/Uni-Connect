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
import api from "@/lib/axios";
import { useModal } from "@/providers/context/modalContext";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";

type DeleteModalProps = {
  groupId: string;
  messageId: string;
};

const DeleteModal = ({ groupId, messageId }: DeleteModalProps) => {
  const { mutateAsync: deleteMessage, isPending: isDeletingMessage } =
    useMutation({
      mutationFn: () => {
        return api.delete(`/api/groups/${groupId}/messages/${messageId}`);
      },
    });

  const { setClose, isOpen } = useModal();

  const handleDelete = async () => {
    await deleteMessage();
    setClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="gap-1 capitalize w-full justify-start"
        >
          <Trash />
          Delete Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Message</DialogTitle>
          <DialogDescription>
            Are you sure that you want to delete this message?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeletingMessage}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeletingMessage}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
