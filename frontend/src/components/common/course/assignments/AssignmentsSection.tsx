import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, differenceInCalendarDays, isSameDay } from "date-fns";
import AssignmentItem from "./AssignmentItem";
import type { Assignment } from "@/types/student/assignment";

import AddAssignmentModal from "@/components/common/course/modals/AddAssignmentModal";

type AssignmentsSectionProps = {
  assignments: Assignment[];
  courseCode: string;
  allowModifyAssignments: boolean;
};

export default function AssignmentsSection({
  assignments,
  courseCode,
  allowModifyAssignments,
}: AssignmentsSectionProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDays, setFilterDays] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAndSortedAssignments = [...assignments]
    .filter((assignment) => {
      // filter by search bar
      const matchesSearch = assignment.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // filter by date
      let matchesDate = true;
      if (filterDate) {
        const deadlineDate = new Date(assignment.deadline_at);
        matchesDate = isSameDay(deadlineDate, filterDate);
      }

      // filter by days
      let matchesDays = true;
      if (filterDays && filterDays !== "all") {
        const deadlineDate = new Date(assignment.deadline_at);
        if (filterDays === "today") {
          matchesDays = isSameDay(deadlineDate, new Date());
        } else {
          const days = Number(filterDays);
          if (!Number.isNaN(days)) {
            const diff = differenceInCalendarDays(deadlineDate, new Date());
            matchesDays = diff >= 0 && diff <= days;
          }
        }
      }

      return matchesSearch && matchesDate && matchesDays;
    })
    .sort((a, b) => {
      const dateA = new Date(a.deadline_at).getTime();
      const dateB = new Date(b.deadline_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // TODO: I feel that we should make the assignment form in a page instead of a modal
  // It has lots of details and we should make the description a rich text editor instead of a textarea

  return (
    <div className="space-y-4">
      {/* Search & Sort Part */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(search) => setSearchQuery(search.target.value)}
              className="pl-10 w-[200px]"
            />
          </div>

          {/* Sort Order */}
          <Select
            value={sortOrder}
            onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Earliest first</SelectItem>
              <SelectItem value="desc">Latest first</SelectItem>
            </SelectContent>
          </Select>
          {/* Filter Days */}
          <Select value={filterDays} onValueChange={setFilterDays}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignments</SelectItem>
              <SelectItem value="today">Due today</SelectItem>
              <SelectItem value="1">Due in 1 day</SelectItem>
              <SelectItem value="2">Due in 2 days</SelectItem>
              <SelectItem value="3">Due in 3 days</SelectItem>
              <SelectItem value="7">Due in 7 days</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {filterDate ? format(filterDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters Button :) */}
          {(filterDays !== "all" || filterDate || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterDays("all");
                setFilterDate(undefined);
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Add Assignment Form */}
        {allowModifyAssignments && (
          <div className="flex justify-end">
            <AddAssignmentModal courseCode={courseCode} />
          </div>
        )}
      </div>

      {/* Assignments Section */}
      <Card className="divide-y gap-0 p-0">
        {filteredAndSortedAssignments.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No assignments found</div>
        ) : (
          filteredAndSortedAssignments.map((assignment) => (
            <AssignmentItem
              key={assignment.id}
              assignment={assignment}
              allowModifyAssignments={allowModifyAssignments}
            />
          ))
        )}
      </Card>
    </div>
  );
}
