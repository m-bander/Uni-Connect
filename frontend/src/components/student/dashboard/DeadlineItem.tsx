import type { CalendarEventType } from "@/types/student/calendar-event"

type DeadlineItemProps = {
  title: string
  date: string
  eventType: CalendarEventType
  backgroundColorClassName: string
}

export default function DeadlineItem({
  title,
  date,
  eventType,
  backgroundColorClassName,
}: DeadlineItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 ${backgroundColorClassName} rounded-full`} />
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-800 p-0">
          {title}
        </div>
        <div className="flex items-center gap-2 text-xs p-0">
          <span className="text-slate-500">{date}</span>
          {eventType && (
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded capitalize">
              {eventType}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
