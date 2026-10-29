import useSignupForm from "@/hooks/use-signup-form";
import { Button } from "../../ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../../ui/field";
import { Spinner } from "../../ui/spinner";
import ConfirmPasswordField from "../reusable-fields/ConfirmPasswordField";
import EmailField from "../reusable-fields/EmailField";
import FirstNameField from "../reusable-fields/FirstNameField";
import ParentNameField from "../reusable-fields/ParentNameField";
import PasswordField from "../reusable-fields/PasswordField";
import RoleField from "./RoleField";
import StudentCodeField from "./StudentCodeField";
import StudentYearField from "./StudentYearField";

const SignupForm = () => {
  const { onSubmit, control, isValid, selectedRole, isSubmitting, trigger } =
    useSignupForm();

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
              {isSubmitting ? "Creating Account" : "Create Account"}
              {isSubmitting && <Spinner />}
            </Button>
          </Field>
          <FieldSeparator />
          
        </FieldGroup>
      </form>
    </>
  );
};

export default SignupForm;
