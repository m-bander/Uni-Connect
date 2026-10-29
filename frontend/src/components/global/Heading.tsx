import type { ReactNode } from "react";

type HeadingProps = {
  children: ReactNode;
};

const Heading = ({ children }: HeadingProps) => {
  return <h1 className="text-4xl font-bold mb-2">{children}</h1>;
};

export default Heading;
