import SignupForm from "@/components/forms/SignupForm/SignupForm";
import Logo from "@/components/global/Logo";
import { Field, FieldDescription } from "@/components/ui/field";
import { Link } from "react-router";

const SignupPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Link to="/" className="self-start">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col items-center gap-1 text-center mb-4">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Fill in the form below to create your account
              </p>
            </div>

            <SignupForm />

            <Field>
              <FieldDescription className="px-6 text-center">
                Already have an account? <Link to="/login">Log in</Link>
              </FieldDescription>
            </Field>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/images/graduate.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default SignupPage;
