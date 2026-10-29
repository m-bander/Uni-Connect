import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Trash2, Loader2 } from "lucide-react";
import type { Material } from "@/types/student/material";
import { CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import { handleDownload } from "@/utils/download-handler";
import EditMaterialModal from "../modals/EditMaterialModal";
import { useState } from "react";
import { useDeleteMaterial } from "@/hooks/student/use-delete-material";
import { getDisplayFileType } from "@/utils/files/getDisplayFileType";

type MaterialItemProps = {
  material: Material;
  allowModifyMaterials?: boolean;
};

export default function MaterialItem({
  material,
  allowModifyMaterials,
}: MaterialItemProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const { handleDeleteMaterial, isDeleting } = useDeleteMaterial(
    material.course_code
  );

  const handleDelete = async (materialId: number) => {
    try {
      setPendingDeleteId(materialId);
      await handleDeleteMaterial(materialId);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const uploadedAt = new Date(material.uploaded_at);
  const now = new Date();
  const diffInMs = now.getTime() - uploadedAt.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  let formattedDate: string;
  if (diffInDays < 7) {
    formattedDate = formatDistanceToNow(uploadedAt, {
      addSuffix: true,
    });
  } else {
    formattedDate = format(uploadedAt, "MMM d, h:mma");
  }

  return (
    <CardContent className="p-6 hover:bg-muted/70 transition-colors">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>

          <div className="flex-1">
            <CardTitle className="text-base font-medium text-foreground">
              {material.title}
            </CardTitle>

            <CardDescription className="flex items-center gap-2 text-sm mt-1">
              <span>{getDisplayFileType(material.file.type)}</span>
              <span>•</span>
              <span>{material.file.size}</span>
              <span>•</span>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>
                {material.uploader.first_name +
                  " " +
                  material.uploader.parent_name}
              </span>
            </CardDescription>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-3 ">
            {allowModifyMaterials && (
              <>
                <EditMaterialModal material={material} />

                {/* Delete Modal */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      disabled={isDeleting && pendingDeleteId === material.id}
                    >
                      {isDeleting && pendingDeleteId === material.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this material?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        remove the material
                        <span className="font-semibold">
                          {" "}
                          "{material.title}"
                        </span>
                        .
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => handleDelete(material.id)}
                      >
                        {isDeleting && pendingDeleteId === material.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            <Button variant="ghost" size="icon" className="cursor-pointer" asChild>
              <a href={material.file.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${material.title}`}>
                <Eye className="w-5 h-5" />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={handleDownload(material.file)}
              aria-label={`Download ${material.title}`}
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
