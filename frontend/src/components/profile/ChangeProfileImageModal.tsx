import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ImageUploader } from "../global/ImageUploader";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFiles } from "@/lib/uploadthingFn";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/providers/context/authContext";

export const ChangeProfileImageModal = ({
  image_url,
}: {
  image_url?: string;
}) => {
  const client = useQueryClient();
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [currImageUrl, setCurrImageUrl] = useState<string | undefined>(
    image_url
  );
  const { setAuth } = useAuth();

  const { mutate: changePicture, isPending } = useMutation({
    mutationKey: ["change-picture"],
    mutationFn: async () => {
      let newImageUrl;

      if (imageFile) {
        const res = await uploadFiles("imageUploader", {
          files: [imageFile],
        });

        if (!res.length || !res[0].serverData.image_url) {
          toast.error("Couldn't upload the image properly! please try again");
          return;
        }
        newImageUrl = res[0].serverData.image_url;
      }

      await api.post("/api/users/change-picture", {
        image_url: newImageUrl,
      });
      return newImageUrl;
    },
    onSuccess: (url) => {
      client.invalidateQueries({ queryKey: ["profile-data"] });
      setAuth((auth) => {
        // TODO: Is this even safe?
        // TODO: Find a better way to handle this
        if (!auth.user) throw new Error("");

        return {
          ...auth,
          user: {
            ...auth.user,
            image_url: url,
          },
        };
      });
      toast.success("Updated profile image successfully.");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          const message = err.response.data.message;
          toast.error(message);
          return;
        }
      }

      toast.error("Unexpected server error");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer mt-2">
          Change Picture
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Your Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="min-h-50 w-full flex items-center justify-center">
          <ImageUploader
            value={currImageUrl}
            handleChooseImage={(file) => {
              setImageFile(file);
              setCurrImageUrl(file && URL.createObjectURL(file));
            }}
            className="w-80 h-full"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isPending}
            onClick={() => changePicture()}
          >
            {isPending && <Spinner />}
            {!currImageUrl && image_url
              ? isPending
                ? "Removing picture"
                : "Remove Picture"
              : isPending
                ? "Updating picture"
                : "Update Picture"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
