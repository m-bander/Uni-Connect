import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { InferredFormSchema } from "@/validations/SignupFormSchema";
import { Controller, type Control } from "react-hook-form";

const StudentCodeField = ({
  control,
}: {
  control: Control<InferredFormSchema>;
}) => {
  return (
    <Controller
      name="studentCode"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="code">College Code</FieldLabel>
          <Input {...field} id="code" aria-invalid={fieldState.invalid} />
          <FieldDescription>
            Enter the code that is used for exams and quizzes.
          </FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default StudentCodeField;
