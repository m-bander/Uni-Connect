import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ReusableFormFieldProps } from "@/types/forms/reusable-form-field-props";
import { Controller, type Path } from "react-hook-form";

const PasswordField = <T extends { password: string }>({
  control,
}: ReusableFormFieldProps<T>) => {
  return (
    <Controller
      name={"password" as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            {...field}
            id="password"
            type="password"
            aria-invalid={fieldState.invalid}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default PasswordField;
