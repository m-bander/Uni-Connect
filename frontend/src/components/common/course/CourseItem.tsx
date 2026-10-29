import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Course } from "@/types/student/course";
import type { ReactNode } from "react";

type CourseItemProps = {
  course: Course;
  createActionElement?: (courseId: string) => ReactNode;
};

const CourseItem = ({ course, createActionElement }: CourseItemProps) => {
  return (
    <Card key={course.code} className="p-4">
      <div className="flex gap-4">
        <img
          src={course.image_url}
          alt={course.name}
          className="size-20 object-cover rounded-lg"
        />
        <div className="flex-1 flex items-center gap-1">
          <h3 className="font-semibold text-foreground mb-1">{course.name}</h3>
          <Badge variant="outline">{course.code}</Badge>
        </div>
      </div>
      {createActionElement?.(course.code)}
    </Card>
  );
};

export default CourseItem;
