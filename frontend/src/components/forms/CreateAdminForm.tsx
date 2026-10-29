import useCreateAdminForm from "@/hooks/use-create-admin-form";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import ConfirmPasswordField from "./reusable-fields/ConfirmPasswordField";
import EmailField from "./reusable-fields/EmailField";
import FirstNameField from "./reusable-fields/FirstNameField";
import ParentNameField from "./reusable-fields/ParentNameField";
import PasswordField from "./reusable-fields/PasswordField";
import { Spinner } from "../ui/spinner";

const CreateAdminForm = () => {
  const { control, isSubmitting, isValid, onSubmit } = useCreateAdminForm();
  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an admin</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Add a new admin to the system.
          </p>
        </div>

        <FirstNameField control={control} />
        <ParentNameField control={control} />
        <EmailField control={control} />
        <PasswordField control={control} />
        <ConfirmPasswordField control={control} />

        <Field>
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Creating Admin" : "Create Admin"}
            {isSubmitting && <Spinner />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default CreateAdminForm;
