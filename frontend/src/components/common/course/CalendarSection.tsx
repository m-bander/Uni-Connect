import DOMPurify from "dompurify";

// Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Types & Constants
import type { CalendarEvent } from "@/types/student/calendar-event";
import { EVENT_TYPE_TO_STYLINGS } from "@/constants/student/calendar";

type CalendarSectionProps = {
  calendarEvents: CalendarEvent[];
};

export default function CalendarSection({
  calendarEvents,
}: CalendarSectionProps) {
  return (
    <div className="space-y-4">
      <Card className="p-8 text-center gap-0">
        <CardHeader>
          <CardTitle>Hello</CardTitle>
          <CardDescription>All deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-72 h-72 rounded-md border">
            {calendarEvents.length === 0 && (
              <p className="ms-3 mt-3">
                There are no events yet for this course.
              </p>
            )}
            {calendarEvents?.map((event, index) => (
              <Item key={event.title + index}>
                <ItemMedia variant="icon">
                  {EVENT_TYPE_TO_STYLINGS[event.type].icon}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <Badge
                      className={`capitalize ${EVENT_TYPE_TO_STYLINGS[event.type].backgroundColorClassName}`}
                    >
                      {event.type}
                    </Badge>
                    {event.title}
                  </ItemTitle>
                  <ItemDescription>
                    {/* Sanitize incoming HTML to prevent XSS */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(event.notes),
                      }}
                    />
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
