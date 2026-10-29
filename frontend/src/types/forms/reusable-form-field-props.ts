import type { Control, FieldValues } from "react-hook-form";

export type ReusableFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
};
