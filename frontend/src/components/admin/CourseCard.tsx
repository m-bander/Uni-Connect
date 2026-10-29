import { useState } from "react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash2, Users } from "lucide-react";

import { useDeleteCourse } from "@/hooks/admin/use-delete-course";
import { EditCourseModal } from "./EditCourseModal";
import type { Course } from "@/types/student/course";

type CourseCardProps = {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { handleDeleteCourse, isDeleting } = useDeleteCourse(course.code);
  
  const handleDelete = async (courseCode: string) => {
    try {
      setPendingDeleteId(courseCode);
      await handleDeleteCourse(courseCode);
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <Card className="flex-row justify-between gap-4 p-4 hover:shadow-md transition-shadow">
      {/* Left Section */}
      <CourseInfo course={course} />

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <EditCourseModal 
          course={course} 
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-blue-100 hover:text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
          } 
        />
        
        {/* Delete Modal */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-100 hover:text-red-600"
              disabled={isDeleting && pendingDeleteId === course.code}
            >
              {isDeleting && pendingDeleteId === course.code ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this course?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently
                remove the course
                <span className="font-semibold">
                  {" "}
                  "{course.name}"
                </span>
                .
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => handleDelete(course.code)}
              >
                {isDeleting && pendingDeleteId === course.code ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

type CourseInfoProps = {
  course: Course;
};
export const CourseInfo = ({ course }: CourseInfoProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center overflow-hidden">
        {course.image_url ? (
          <img src={course.image_url} alt={course.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold text-lg">{course.code.substring(0, 2)}</span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{course.name}</h3>
        <p className="text-sm text-muted-foreground">
          {course.code} • Year {course.year}
        </p>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground ml-4">
        <Users className="w-4 h-4" />
        <span className="text-sm">{course.students_number} students</span>
      </div>
    </div>
  )
}