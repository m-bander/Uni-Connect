import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MaterialForm from "@/components/forms/CourseForms/MaterialForm";
import type { Material } from "@/types/student/material";

type EditMaterialModalProps = {
  material: Material;
};

export default function EditMaterialModal({
  material,
}: EditMaterialModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
          <DialogDescription>
            Update the details of this material.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <MaterialForm
            mode="edit"
            materialId={material.id}
            courseCode={material.course_code}
            materialData={material}
            onClose={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
