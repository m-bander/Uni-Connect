import { Download, Eye, FileText, Trash } from "lucide-react";
import type { File } from "@/types/student/file";
import { Button } from "@/components/ui/button";
import downloadFromLink from "@/utils/files/downloadFile";

type FileCardProps = {
  onDelete?: () => void;
  deleteButtonDisabled?: boolean;
  file: Pick<File, "name" | "url">;
  showDownload?: boolean;
  showDelete?: boolean;
  showView?: boolean;
};

const FileCard = ({
  onDelete,
  deleteButtonDisabled = false,
  file,
  showDownload = false,
  showDelete = true,
  showView = true,
}: FileCardProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-sm text-foreground">{file.name}</span>
      </div>
      <div>
        {showDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={deleteButtonDisabled}
            type="button"
          >
            <Trash className="size-4" aria-label="Delete file" />
          </Button>
        )}
        {showView && (
          <Button variant="ghost" size="icon" asChild type="button">
            <a href={file.url} target="_blank">
              <Eye className="size-4" aria-label="View file" />
            </a>
          </Button>
        )}
        {showDownload && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => downloadFromLink(file.url, "file")}
          >
            <Download className="size-4" aria-label="View file" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileCard;
