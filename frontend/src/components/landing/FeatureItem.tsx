import { Check } from "lucide-react";

type FeatureItemProps = {
  feature: string;
};

const FeatureItem = ({ feature }: FeatureItemProps) => {
  return (
    <li className="flex items-start gap-2">
      <Check className="text-primary shrink-0 size-5" />
      <span className="mb-2 inline-block">{feature}</span>
    </li>
  );
};

export default FeatureItem;
