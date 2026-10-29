import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MaterialForm from "@/components/forms/CourseForms/MaterialForm";

type AddMaterialModalProps = {
  courseCode: string;
};

export default function AddMaterialModal({ courseCode }: AddMaterialModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Material</DialogTitle>
        </DialogHeader>

        <MaterialForm
          mode="create"
          courseCode={courseCode}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}