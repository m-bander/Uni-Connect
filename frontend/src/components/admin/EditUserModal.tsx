// src/components/admin/EditUserModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import EditUserForm from "@/components/forms/AdminForms/EditUserForm";
import type { User } from "@/types/user/user";

type EditUserModalProps = {
  user: User;
};

export const EditUserModal = ({ user }: EditUserModalProps) => {
  const [open, setOpen] = useState(false);

  if (!user) return;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-blue-100 hover:text-blue-600">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information.
          </DialogDescription>
        </DialogHeader>
        <EditUserForm user={user} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;