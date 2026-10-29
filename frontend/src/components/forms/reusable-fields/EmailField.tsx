import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ReusableFormFieldProps } from "@/types/forms/reusable-form-field-props";
import { Controller, type Path } from "react-hook-form";

const EmailField = <T extends { email: string }>({
  control,
}: ReusableFormFieldProps<T>) => {
  return (
    <Controller
      name={"email" as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...field}
            id="email"
            aria-invalid={fieldState.invalid}
            placeholder="m@example.com"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default EmailField;
