import SubtleParagraph from "@/components/global/SubtleParagraph";
import Teachers from "@/components/student/dashboard/Teachers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useProfile from "@/hooks/shared/use-profile";
import { ArrowLeft, Book, IdCard, Mail, User } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router";

const ProfilePage = () => {
  const { profile_id } = useParams();
  const [searchParams] = useSearchParams();
  const { isLoadingProfile, profile } = useProfile(profile_id);

  const backHref = searchParams.get("back");

  // TODO: Place a loading skeleton or a lottie
  // TODO: Show a 404 if profile doesn't exist

  if (isLoadingProfile || !profile) return;

  return (
    <Card className="max-w-2xl absolute top-1/2 left-1/2 -translate-1/2">
      {backHref && (
        <Button className="self-start ms-3" variant="ghost" asChild>
          <Link to={backHref}>
            <ArrowLeft /> Back
          </Link>
        </Button>
      )}
      <CardHeader className="-mt-3">
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Avatar className="size-16 rounded-full">
            <AvatarImage src={profile.image_url} alt={profile.first_name} />
            <AvatarFallback className="rounded-full">
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="">
            <div>
              <h1 className="capitalize font-bold text-2xl">{`${profile.first_name} ${profile.parent_name}`}</h1>
              <span>
                {profile.role === "professor/ta" &&
                  "Professor/Teaching Assistant"}
                {profile.role === "student" &&
                  "year" in profile &&
                  `Student at year ${profile.year}`}
                {profile.role === "class_representative" &&
                  "year" in profile &&
                  `Student at year ${profile.year} and is the representative of its class`}
                {profile.role === "course_head" &&
                  "year" in profile &&
                  `Student at year ${profile.year} and is the head of one or more courses`}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="size-5" />
                <a
                  href={`mailto:${profile.email}`}
                  className="text-primary underline hover:no-underline mb-1"
                >
                  {profile.email}
                </a>
              </span>
              {"code" in profile && profile.code && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1.5">
                      <IdCard className="size-5" />
                      {profile.code}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Student Code</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <Separator className="my-3" />
        <h2 className="font-bold text-xl">About</h2>
        <p className="text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex possimus
          labore nesciunt tempora. Ducimus molestias repellendus minima fugit!
          Omnis unde ex repellendus voluptate, nesciunt corporis quam vero
          voluptates non perspiciatis?
        </p>
        {profile.courses.length > 0 && (
          <>
            <Separator className="my-3" />
            <h2 className="font-bold text-xl">Courses</h2>
            <SubtleParagraph>
              {profile.role === "professor/ta" &&
                "The courses that the instructor teaches"}
              {["student", "class_representative", "course_head"].includes(
                profile.role
              ) && "The courses that the student is enrolled in"}
              {profile.courses.map((course) => (
                <Item key={course.code}>
                  <ItemMedia variant="icon">
                    <Book />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{course.name}</ItemTitle>
                    <ItemDescription>
                      <Teachers teachers={course.teachers} />
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </SubtleParagraph>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
