import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SubtleParagraphProps = {
  children: ReactNode;
  className?: string;
};

const SubtleParagraph = ({ children, className }: SubtleParagraphProps) => {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>
  );
};

export default SubtleParagraph;
