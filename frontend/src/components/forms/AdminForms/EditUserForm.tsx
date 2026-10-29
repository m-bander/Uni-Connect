import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import type { User } from "@/types/user/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";

import EmailField from "../reusable-fields/EmailField";
import FirstNameField from "../reusable-fields/FirstNameField";
import ParentNameField from "../reusable-fields/ParentNameField";

import useEditUser from "@/hooks/admin/use-edit-user";

type EditUserFormProps = {
  user: User;
  onClose: () => void;
};

export default function EditUserForm({ user, onClose }: EditUserFormProps) {
  const queryClient = useQueryClient();
  const { control, onSubmit, isSubmitting, dirtyFields, trigger } = useEditUser({ 
    user,
    onSuccess: onClose,
  });

  // Trigger validation on mount to ensure form is valid with existing values
  useEffect(() => {
    trigger();
  }, [trigger]);

  const { mutateAsync: promoteToClassRep, isPending: isPromoting } = useMutation({
    mutationFn: async () => {
      return api.put(`/api/users/${user.id}`, {
        role: "class_representative",
      });
    },
    onSuccess: () => {
      toast.success(`${user.first_name} ${user.parent_name} has been promoted to Class Representative.`);
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data && "message" in err.response.data) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while promoting the user. Please try again.");
      }
    },
  });

  // Show promote button only if user is a student or course_head
  const canPromoteToClassRep = user.role === "student" || user.role === "course_head";

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <FieldGroup>
        <FirstNameField control={control} />
        <ParentNameField control={control} />

        <EmailField control={control} />

        {canPromoteToClassRep && (
          <>
            <FieldSeparator />
            <Field>
              <Button
                type="button"
                variant="outline"
                onClick={() => promoteToClassRep()}
                disabled={isPromoting || isSubmitting}
                className="w-full"
              >
                {isPromoting ? (
                  <>
                    Promoting...
                    <Spinner />
                  </>
                ) : (
                  "Promote To Class Rep"
                )}
              </Button>
            </Field>
          </>
        )}

        <FieldSeparator />

        {/* Action Buttons */}
        <Field>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              disabled={
                Object.keys(dirtyFields).length === 0 || 
                isSubmitting
              }
            >
              {isSubmitting ? "Saving Changes..." : "Update User"}
              {isSubmitting && <Spinner />}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}