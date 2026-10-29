import { Calendar } from "@/components/ui/calendar";
import { EVENT_TYPE_TO_STYLINGS } from "@/constants/student/calendar";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/student/calendar-event";
import type { Dispatch, SetStateAction } from "react";

type ConfiguredCalendarProps = {
  selectedDate: Date;
  onSelectDate: Dispatch<SetStateAction<Date>>;
  calendarEvents: CalendarEvent[];
};

const ConfiguredCalendar = ({
  selectedDate,
  onSelectDate,
  calendarEvents,
}: ConfiguredCalendarProps) => {
  return (
    <Calendar
      selected={selectedDate}
      onSelect={onSelectDate}
      // animate
      captionLayout="label"
      mode="single"
      required
      showOutsideDays={false}
      className="rounded-lg border select-none"
      components={{
        Day: (props) => {
          if (props.day.outside) {
            return <td className="size-10" />;
          }

          const currentTileDate = props.day.date.toDateString();

          const calendarEventsAtCurrentDate = calendarEvents.filter(
            (event) =>
              new Date(event.deadline_at).toDateString() === currentTileDate
          );

          const deadlineIndicatorDiameter = 6;
          const deadlineIndicatorMarginBottom = 1;
          const deadlineIndicatorOffset = 3;

          const currentTileIsSelected =
            props.day.date.toDateString() === selectedDate.toDateString();

          return (
            <td
              {...props}
              onClick={() => {
                onSelectDate(props.day.date);
              }}
              className={cn(
                "relative flex items-center justify-center size-10 rounded-md",
                {
                  "hover:bg-gray-100": !currentTileIsSelected,
                  "text-white bg-black": currentTileIsSelected,
                }
              )}
            >
              <span>{props.day.date.getDate()}</span>

              {calendarEventsAtCurrentDate.map((event, index) => (
                <span
                  key={index}
                  className={`end-1 absolute rounded-full ${EVENT_TYPE_TO_STYLINGS[event.type].backgroundColorClassName}`}
                  style={{
                    top: `${index * (deadlineIndicatorDiameter + deadlineIndicatorMarginBottom) + deadlineIndicatorOffset}px`,
                    width: `${deadlineIndicatorDiameter}px`,
                    height: `${deadlineIndicatorDiameter}px`,
                  }}
                />
              ))}
            </td>
          );
        },
      }}
    />
  );
};

export default ConfiguredCalendar;
