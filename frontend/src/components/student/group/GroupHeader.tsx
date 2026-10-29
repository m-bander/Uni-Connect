import Logo from "@/components/global/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardTitle } from "@/components/ui/card";

type GroupHeaderProps = {
  image_url: string;
  name: string;
};

const GroupHeader = ({ image_url, name }: GroupHeaderProps) => {
  return (
    <CardHeader
      className="border-b shadow-md"
      style={{ paddingBlock: "calc(var(--spacing) * 3)" }}
    >
      <CardTitle className="flex items-center gap-x-2">
        <Avatar className="size-12">
          <AvatarImage src={image_url} />
          <AvatarFallback>
            <Logo imageClassName="size-6 opacity-60" showText={false} />
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{name}</h2>
      </CardTitle>
    </CardHeader>
  );
};

export default GroupHeader;
