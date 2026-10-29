import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export const ImageUploader = ({
  className,
  handleChooseImage,
  value,
}: Pick<React.ComponentProps<"image">, "className"> & {
  handleChooseImage: (file: File | undefined) => unknown;
  value?: string;
}) => {
  return (
    <div>
      {value ? (
        <div className={cn("relative group", className)}>
          <div
            className="
                absolute inset-0
                bg-black/40
                opacity-0
                group-hover:opacity-100
                transition-opacity
                flex items-center justify-center
                rounded-md
                cursor-pointer
            "
            onClick={() => {
              handleChooseImage(undefined);
            }}
          >
            <Trash2 className="text-white w-8 h-8" />
          </div>
          <img
            src={value}
            className="rounded-md border object-cover w-full h-full"
          />
        </div>
      ) : (
        <Input
          id="picture"
          type="file"
          accept="image/png, image/jpeg"
          onChange={async (e) => {
            if (!e.target.files) return;
            const file = Array.from(e.target.files)[0];
            handleChooseImage(file);
          }}
        />
      )}
    </div>
  );
};
