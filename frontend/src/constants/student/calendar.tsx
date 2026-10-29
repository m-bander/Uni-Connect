import type { CalendarEventType } from "@/types/student/calendar-event";
import {
  BookA,
  ChartBarIncreasing,
  ClipboardList,
  Microscope,
  NotebookPen,
  Presentation,
} from "lucide-react";
import type { ReactNode } from "react";

export const EVENT_TYPE_TO_STYLINGS: Record<
  CalendarEventType,
  { backgroundColorClassName: string; icon: ReactNode; prettyName?: string }
> = {
  exam: {
    backgroundColorClassName: "bg-red-600",
    icon: <ClipboardList />,
  },
  poll: {
    backgroundColorClassName: "bg-green-400",
    icon: <ChartBarIncreasing />,
  },
  project: {
    backgroundColorClassName: "bg-yellow-400",
    icon: <Presentation />,
  },
  quiz: {
    backgroundColorClassName: "bg-blue-600",
    icon: <NotebookPen />,
  },
  assignment: {
    backgroundColorClassName: "bg-violet-700",
    icon: <BookA />,
  },
  lab_exam: {
    backgroundColorClassName: "bg-orange-600",
    icon: <Microscope />,
    prettyName: "lab exam",
  },
};
