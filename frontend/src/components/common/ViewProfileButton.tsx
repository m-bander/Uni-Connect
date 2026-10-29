import { Link } from "react-router";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SquareArrowOutUpRight } from "lucide-react";

type ViewProfileButtonProps = {
  profileId: string;
};

const ViewProfileButton = ({ profileId }: ViewProfileButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          className="rounded-full"
          aria-label="View Profile"
          asChild
        >
          <Link to={`/profiles/${profileId}?back=${window.location.href}`}>
            <SquareArrowOutUpRight aria-label="View profile" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>View Profile</TooltipContent>
    </Tooltip>
  );
};

export default ViewProfileButton;
