import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { User } from "@/types/user/user";
import type { ReactNode } from "react";
import ViewProfileButton from "../../ViewProfileButton";

type MemberProps = {
  member: User;
  extraActions?: ReactNode;
};

const Member = ({ member, extraActions }: MemberProps) => {
  return (
    <Item variant="outline" className="mb-3">
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src={member.image_url} />
          <AvatarFallback className="uppercase">
            {member.first_name[0] + member.parent_name[0]}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{`${member.first_name} ${member.parent_name}`}</ItemTitle>
      </ItemContent>
      <ItemActions>
        {extraActions}
        <ViewProfileButton profileId={member.id} />
      </ItemActions>
    </Item>
  );
};

export default Member;
