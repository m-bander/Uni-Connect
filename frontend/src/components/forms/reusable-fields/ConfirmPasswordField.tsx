import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ReusableFormFieldProps } from "@/types/forms/reusable-form-field-props";
import { Controller, type Path } from "react-hook-form";

const ConfirmPasswordField = <T extends { confirmPassword: string }>({
  control,
}: ReusableFormFieldProps<T>) => {
  return (
    <Controller
      name={"confirmPassword" as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            {...field}
            type="password"
            id="confirm-password"
            aria-invalid={fieldState.invalid}
          />
          <FieldDescription>Please re-enter your password.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default ConfirmPasswordField;
