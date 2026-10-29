import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useChangePassForm } from "@/hooks/student/use-change-pass-form";
import { Controller } from "react-hook-form";

export const ChangePasswordForm = () => {
  const { control, onSubmit, isPending, isValid } = useChangePassForm();
  return (
    <form className="w-full" onSubmit={onSubmit}>
      <FieldGroup>
        <FieldLegend>Change password</FieldLegend>
        <Controller
          name="oldPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel>Old password</FieldLabel>
              <Input
                {...field}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter old password"
              />
              {fieldState.invalid && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel>New password</FieldLabel>
              <Input
                {...field}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter new password"
              />
              {fieldState.invalid && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Button disabled={!isValid || isPending}>
          {isPending && <Spinner />}
          {isPending ? "Changing password" : "Change password"}
        </Button>
      </FieldGroup>
    </form>
  );
};
