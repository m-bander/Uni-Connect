import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ReusableFormFieldProps } from "@/types/forms/reusable-form-field-props";
import { Controller, type Path } from "react-hook-form";

const FirstNameField = <T extends { firstName: string }>({
  control,
}: ReusableFormFieldProps<T>) => {
  return (
    <Controller
      name={"firstName" as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="first-name">First Name</FieldLabel>
          <Input
            {...field}
            id="first-name"
            aria-invalid={fieldState.invalid}
            placeholder="Ahmed"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FirstNameField;
