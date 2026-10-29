import AddEventModal from "@/components/common/calendar/AddEventModal";
import ConfiguredCalendar from "@/components/common/calendar/ConfiguredCalendar";
import Legend from "@/components/common/calendar/Legend";
import SelectedDayDetails from "@/components/common/calendar/SelectedDayDetails";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCurrentUserCourses from "@/hooks/shared/use-current-user-courses";
import { useStudentCalendar } from "@/hooks/student/use-student-calendar";
import { useAuth } from "@/providers/context/authContext";
import { useState } from "react";

export default function Calendar() {
  const { calendarEvents, date, isLoading, setDate } = useStudentCalendar();
  const { currentUserCourses, isLoadingCurrentUserCourses } =
    useCurrentUserCourses();
  const { auth } = useAuth();

  const userRole = auth.user?.role;
  const allowModifyEvents =
    userRole &&
    ["professor/ta", "class_representative", "course_head"].includes(userRole);

  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const filteredEvents =
    calendarEvents?.filter((event) => {
      if (selectedCourse === "all") return true;
      return event.course_id === selectedCourse;
    }) ?? [];

  return (
    <div className="p-4">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">Calendar</h1>

      {/* Main Layout */}
      <div>
        {/* Course Filter + Add Form */}
        <div className="flex justify-between items-center gap-3">
          <div className="flex justify-between items-center gap-3">
            <label className="text-sm text-muted-foreground hidden md:block">
              Filter by course
            </label>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[220px]">
                <SelectValue
                  placeholder={
                    isLoadingCurrentUserCourses
                      ? "Loading courses..."
                      : "All courses"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>

                {currentUserCourses.map((course) => (
                  <SelectItem key={course.code} value={course.code}>
                    <span className="font-bold text-blue-700 text-sm">
                      {course.code}
                    </span>{" "}
                    - <span className="text-gray-800">{course.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            {allowModifyEvents && (
              <div className="flex justify-end mb-4">
                <AddEventModal />
              </div>
            )}
          </div>
        </div>
        {/* Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8 max-w-6xl mx-auto py-8">
          <div>
            <ConfiguredCalendar
              selectedDate={date}
              onSelectDate={setDate}
              calendarEvents={filteredEvents}
            />
          </div>

          <div className="space-y-6">
            <SelectedDayDetails
              selectedDate={date}
              isLoading={isLoading}
              calendarEvents={filteredEvents}
              allowModifyEvents={!!allowModifyEvents}
            />
            <Legend />
          </div>
        </div>
      </div>
    </div>
  );
}
