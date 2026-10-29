import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SELECTABLE_ROLES } from "@/constants/user/role";
import type { InferredFormSchema } from "@/validations/SignupFormSchema";
import { Controller, type Control, type UseFormTrigger } from "react-hook-form";

const RoleField = ({
  control,
  trigger,
}: {
  control: Control<InferredFormSchema>;
  trigger: UseFormTrigger<InferredFormSchema>;
}) => {
  return (
    <Controller
      name="role"
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="responsive" data-invalid={fieldState.invalid}>
          <FieldLabel>Role</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            onOpenChange={(open) => {
              // When the select box is closed, force a revalidation since it does not revalidate automatically for some reason
              if (!open) {
                // Delay the revalidation a bit, to give react-hook-form a chance to set the value the user selected if they did so
                queueMicrotask(() => trigger("role"));
              }
            }}
          >
            <SelectTrigger
              id="role"
              aria-invalid={fieldState.invalid}
              className="min-w-[120px]"
            >
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {SELECTABLE_ROLES.map((role) => (
                <SelectItem key={role} value={role.toLowerCase()}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default RoleField;
