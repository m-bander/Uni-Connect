import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfileForm } from "@/hooks/use-profile-form";
import { Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { useHasRole } from "@/hooks/use-has-role";
import type { User } from "@/types/user/user";

type ProfileFormProps = {
  userData: User;
};

export const ProfileForm = ({ userData }: ProfileFormProps) => {
  const { onSubmit, control, isSubmiting, isValid } = useProfileForm(userData);
  const { hasRole } = useHasRole();
  return (
    <form className="w-full" onSubmit={onSubmit}>
      <FieldGroup>
        <FieldSet className="grid grid-cols-1 md:grid-cols-2">
          <FieldLegend>
            <span className="text-xl font-bold">Profile Details</span>
          </FieldLegend>

          {hasRole("class_representative", "course_head", "student") && (
            <Field className="col-span-2">
              <FieldLabel>Student Code</FieldLabel>
              <Input
                placeholder="Student Code"
                readOnly
                disabled
                value={userData.code}
              />
            </Field>
          )}

          {hasRole("class_representative", "course_head", "student") && (
            <Field className="col-span-2">
              <FieldLabel>Student Year</FieldLabel>
              <Input
                placeholder="Student Year"
                readOnly
                disabled
                value={userData.year}
              />
            </Field>
          )}

          {/* First Name */}
          <Controller
            name="first_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="col-span-2 md:col-span-1"
              >
                <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                <Input
                  {...field}
                  id="first_name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Update your first name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Parent's Name */}
          <Controller
            name="parent_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="col-span-2 md:col-span-1"
              >
                <FieldLabel htmlFor="parent_name">Parent's Name</FieldLabel>
                <Input
                  {...field}
                  id="parent_name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Update your parent's name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Grandparent's Name */}
          <Controller
            name="grandparent_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="col-span-2 md:col-span-1"
              >
                <FieldLabel htmlFor="grandparent_name">
                  Grandparent's Name
                </FieldLabel>
                <Input
                  {...field}
                  id="grandparent_name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Update your grandparent's name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Family Name */}
          <Controller
            name="family_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="col-span-2 md:col-span-1"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor="family_name">Family Name</FieldLabel>
                <Input
                  {...field}
                  id="family_name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Update your family name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="col-span-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">E-Mail</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="m@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldSet>
        <FieldSet>
          <Field>
            <Button type="submit" disabled={isSubmiting || !isValid}>
              {isSubmiting ? "Saving Changes" : "Save Changes"}
              {isSubmiting && <Spinner />}
            </Button>
          </Field>
        </FieldSet>
      </FieldGroup>
    </form>
  );
};
