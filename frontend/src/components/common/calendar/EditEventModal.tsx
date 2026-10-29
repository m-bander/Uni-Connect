import EventForm from "@/components/forms/CourseForms/EventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CalendarEvent } from "@/types/student/calendar-event";
import { Edit } from "lucide-react";
import { useState } from "react";

type EditEventModalProps = {
  event: CalendarEvent;
};

const toInputDate = (timestamp: number) =>
  new Date(timestamp).toISOString().slice(0, 10);

const toInputTime = (timestamp: number) =>
  new Date(timestamp).toISOString().slice(11, 16);

export default function EditEventModal({ event }: EditEventModalProps) {
  const [open, setOpen] = useState(false);

  const defaultValues = {
    title: event.title,
    notes: event.notes,
    dueDate: toInputDate(event.deadline_at),
    dueTime: toInputTime(event.deadline_at),
    type: event.type,
    courseCode: event.course_id,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted"
          disabled={event.type === "assignment"}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the details of this event.
          </DialogDescription>
        </DialogHeader>

        <EventForm
          mode="edit"
          eventId={event.id}
          defaultValues={defaultValues}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
