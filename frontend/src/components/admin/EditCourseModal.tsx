import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { BookOpen, Edit, GraduationCap, Users } from "lucide-react";
import { useCourseForm } from "@/hooks/instructor/use-course-form";
import { useGetCourseUsers } from "@/hooks/admin/use-get-course-users";
import { CourseFieldGroup } from "../instructor/CourseFieldGroup";
import { CourseUsersTab } from "@/components/admin/CourseUsersTab";
import type { Course } from "@/types/student/course";
import { Spinner } from "../ui/spinner";
import { useState } from "react";

type EditCourseModalProps = {
  course: Course | null;
  trigger?: React.ReactNode;
};

export const EditCourseModal = ({ course, trigger }: EditCourseModalProps) => {

  const { students, instructors, isLoading: isLoadingUsers } = useGetCourseUsers(course?.code);
  const [open, setOpen] = useState(false);
  const { control, isValid, onSubmit, isPending, isSubmitting, handleImageChange } =
    useCourseForm(course ?? undefined, () => setOpen(false));

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-100 hover:text-blue-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Update the course</DialogTitle>
          <DialogDescription>
            Update course information or manage users.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="info" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Course Info</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Students</span>
              <span className="sm:hidden">Studs.</span>
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {students.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="instructors" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Instructors</span>
              <span className="sm:hidden">Instr.</span>
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {instructors.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 flex-1 overflow-hidden">
            <form onSubmit={onSubmit} className="flex flex-col h-full">
              <ScrollArea className="flex-1 pr-4">
                <div className="pb-4">
                  <CourseFieldGroup control={control} disableCode={true} handleImageChange={handleImageChange} />
                </div>
              </ScrollArea>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isPending ? "Updating Course" : "Update Course"}
                  {isPending && <Spinner />}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="students" className="mt-4">
            {isLoadingUsers ? (
              <div className="text-center py-8">
                <Spinner />
                <p className="text-muted-foreground mt-2">
                  Loading students...
                </p>
              </div>
            ) : (
              <CourseUsersTab
                courseCode={course.code}
                users={students}
                type="students"
              />
            )}
          </TabsContent>

          <TabsContent value="instructors" className="mt-4">
            {isLoadingUsers ? (
              <div className="text-center py-8">
                <Spinner />
                <p className="text-muted-foreground mt-2">
                  Loading instructors...
                </p>
              </div>
            ) : (
              <CourseUsersTab
                courseCode={course.code}
                users={instructors}
                type="instructors"
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
