import Logo from "@/components/global/Logo";
import type { ReactNode } from "react";

type FormPageProps = {
  form: ReactNode;
  imageUrl: string;
};

const FormPage = ({ form, imageUrl }: FormPageProps) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{form}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default FormPage;
