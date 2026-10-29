import CreateAdminForm from "@/components/forms/CreateAdminForm";
import FormPage from "../FormPage";

const CreateAdminPage = () => {
  return (
    // TODO: Add attribution
    // <a href="https://www.freepik.com/free-vector/hand-drawn-data-driven-illustration_29822983.htm">Image by pikisuperstar on Freepik</a>
    <FormPage form={<CreateAdminForm />} imageUrl="/images/admin.jpg" />
  );
};

export default CreateAdminPage;
