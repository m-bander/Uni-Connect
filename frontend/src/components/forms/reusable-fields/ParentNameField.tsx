import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ReusableFormFieldProps } from "@/types/forms/reusable-form-field-props";
import { Controller, type Path } from "react-hook-form";

const ParentNameField = <T extends { parentName: string }>({
  control,
}: ReusableFormFieldProps<T>) => {
  return (
    <Controller
      name={"parentName" as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="second-name">Second Name</FieldLabel>
          <Input
            {...field}
            id="second-name"
            aria-invalid={fieldState.invalid}
            placeholder="Mohammed"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default ParentNameField;
