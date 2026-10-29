import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { YEARS } from "@/constants/student/student";
import type { InferredFormSchema } from "@/validations/SignupFormSchema";
import { Controller, type Control, type UseFormTrigger } from "react-hook-form";

const StudentYearField = ({
  control,
  trigger,
}: {
  control: Control<InferredFormSchema>;
  trigger: UseFormTrigger<InferredFormSchema>;
}) => {
  return (
    <Controller
      name="year"
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="responsive" data-invalid={fieldState.invalid}>
          <FieldLabel>Current Year</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            onOpenChange={(open) => {
              // When the select box is closed, force a revalidation since it does not revalidate automatically for some reason
              if (!open) {
                // Delay the revalidation a bit, to give react-hook-form a chance to set the value the user selected if they did so
                queueMicrotask(() => trigger("year"));
              }
            }}
          >
            <SelectTrigger
              id="year"
              aria-invalid={fieldState.invalid}
              className="min-w-[120px]"
            >
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldDescription>
            Enter your current year at university.
          </FieldDescription>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default StudentYearField;
