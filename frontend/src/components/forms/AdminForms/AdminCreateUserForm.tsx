import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import ConfirmPasswordField from "../reusable-fields/ConfirmPasswordField";
import EmailField from "../reusable-fields/EmailField";
import FirstNameField from "../reusable-fields/FirstNameField";
import ParentNameField from "../reusable-fields/ParentNameField";
import PasswordField from "../reusable-fields/PasswordField";
import RoleField from "../SignupForm/RoleField";
import StudentCodeField from "../SignupForm/StudentCodeField";
import StudentYearField from "../SignupForm/StudentYearField";
import useAdminCreateUserForm from "@/hooks/admin/use-admin-create-user-form";

type AdminCreateUserFormProps = {
  onSuccess?: () => void;
};

const AdminCreateUserForm = ({ onSuccess }: AdminCreateUserFormProps) => {
  const { onSubmit, control, isValid, selectedRole, isSubmitting, trigger } =
    useAdminCreateUserForm({ onSuccess });

  return (
    <>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <FieldGroup>
          
          <FirstNameField control={control} />
          <ParentNameField control={control} />

          <EmailField control={control} />

          <PasswordField control={control} />
          <ConfirmPasswordField control={control} />

          <RoleField control={control} trigger={trigger} />

          {selectedRole === "student" && (
            <>
              <FieldSeparator />
              <FieldSet>
                <FieldLegend>College Details</FieldLegend>
                <FieldDescription>
                  College details which will make your professor and your lives
                  easier.
                </FieldDescription>

                <StudentCodeField control={control} />

                <StudentYearField control={control} trigger={trigger} />
              </FieldSet>
            </>
          )}

          <Field>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Creating User" : "Create User"}
              {isSubmitting && <Spinner />}
            </Button>
          </Field>
          <FieldSeparator />
          
        </FieldGroup>
      </form>
    </>
  );
};

export default AdminCreateUserForm;

