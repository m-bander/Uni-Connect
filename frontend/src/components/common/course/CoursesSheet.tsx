import CourseItem from "@/components/common/course/CourseItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Course } from "@/types/student/course";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

type CoursesSheetProps = {
  courses: Course[];
  triggerText: string;
  sheetDescription: string;
  createCourseActionElement: (courseId: string) => ReactNode;
  extras?: ReactNode;
};

const CoursesSheet = ({
  courses,
  triggerText,
  createCourseActionElement,
  sheetDescription,
  extras,
}: CoursesSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          {triggerText}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] gap-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-gray-800 text-xl">
            Available Courses
          </SheetTitle>
          <SheetDescription>{sheetDescription}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-180px)] p-6">
          <div className="space-y-4">
            {courses.map((course) => (
              <CourseItem
                key={course.code}
                course={course}
                createActionElement={createCourseActionElement}
              />
            ))}
          </div>
        </ScrollArea>
        {extras}
      </SheetContent>
    </Sheet>
  );
};

export default CoursesSheet;
