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
import { EVENT_TYPE_TO_STYLINGS } from "@/constants/student/calendar";
import DOMPurify from "dompurify";
import type { CalendarEvent } from "@/types/student/calendar-event";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditEventModal from "@/components/common/calendar/EditEventModal";
import { useDeleteEvent } from "@/hooks/student/use-delete-event";
// import { useHasRole } from "@/hooks/use-has-role";
// import { useAuth } from "@/providers/context/authContext";

type SelectedDayDetailsProps = {
  selectedDate: Date;
  isLoading: boolean;
  calendarEvents: CalendarEvent[];
  allowModifyEvents: boolean;
};

const SelectedDayDetails = ({
  selectedDate,
  isLoading,
  calendarEvents,
  allowModifyEvents,
}: SelectedDayDetailsProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { handleDeleteEvent, isDeleting } = useDeleteEvent();
  // const { hasRole } = useHasRole();
  // const { auth } = useAuth();

  const formattedDate = selectedDate?.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const selectedDayEvents = calendarEvents.filter(
    (event) => new Date(event.deadline_at).getDate() === selectedDate.getDate()
  );

  const handleDelete = async (eventId: string) => {
    try {
      setPendingDeleteId(eventId);
      await handleDeleteEvent(eventId);
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p>{formattedDate}</p>
        </CardTitle>
        <CardDescription>
          Select a day to view the details of its deadlines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-72 h-72 rounded-md border">
          {selectedDayEvents.length === 0 && !isLoading && (
            <p className="ms-3 mt-3">No events at the selected day.</p>
          )}
          {selectedDayEvents?.map((event) => (
            <Item key={event.id} className="flex items-start justify-between">
              <ItemMedia variant="icon">
                {EVENT_TYPE_TO_STYLINGS[event.type].icon}
              </ItemMedia>
              <ItemContent>
                {/* Title + Edit & Delete Buttons */}
                <div className="flex items-start justify-between gap-2">
                  <ItemTitle className="flex-1 flex flex-col items-start">
                    <span className="font-bold text-lg">{event.title}</span>
                    <div>
                      <Badge
                        className={`capitalize me-1 ${EVENT_TYPE_TO_STYLINGS[event.type].backgroundColorClassName}`}
                      >
                        {EVENT_TYPE_TO_STYLINGS[event.type].prettyName ||
                          event.type}
                      </Badge>
                      <Badge className={`capitalize me-2`} variant="outline">
                        {event.course_id}
                      </Badge>
                    </div>
                  </ItemTitle>

                  {/* Action Buttons - only for users allowed to modify events */}
                  {allowModifyEvents && (
                    <div className="flex items-center gap-1 shrink-0">
                      <EditEventModal event={event} />

                      {/* Delete Modal */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            disabled={
                              (isDeleting && pendingDeleteId === event.id) ||
                              event.type === "assignment"
                            }
                          >
                            {isDeleting && pendingDeleteId === event.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this event?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently remove the event
                              <span className="font-semibold">
                                {" "}
                                "{event.title}"
                              </span>
                              .
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => handleDelete(event.id)}
                            >
                              {isDeleting && pendingDeleteId === event.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                <ItemDescription>
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
  );
};

export default SelectedDayDetails;
