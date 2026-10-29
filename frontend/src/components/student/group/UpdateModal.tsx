import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { useModal } from "@/providers/context/modalContext";
import type { Message } from "@/types/student/message";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type UpdateModalProps = {
  message: Message;
  groupId: string;
};

const UpdateModal = ({ message, groupId }: UpdateModalProps) => {
  const [content, setContent] = useState(message.content);

  const { mutateAsync: updateMessage, isPending: isUpdatingMessage } =
    useMutation({
      mutationFn: () => {
        const updatedMessage = {
          ...message,
          content,
        };

        return api.patch(
          `/api/groups/${groupId}/messages/${message.id}`,
          updatedMessage
        );
      },
    });

  const { setClose, isOpen } = useModal();

  const handleUpdate = async () => {
    await updateMessage();
    setClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Message</DialogTitle>
        </DialogHeader>
        <div>
          <Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isUpdatingMessage}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={content.trim() === "" || isUpdatingMessage}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateModal;
