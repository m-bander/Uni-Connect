import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { EVENT_TYPE_TO_STYLINGS } from "@/constants/student/calendar";
import useDashboardDeadlines from "@/hooks/student/use-dashboard-deadlines";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import DeadlineItem from "./DeadlineItem";

type DashboardDeadlinesProps = {
  formatDeadlineDate: (timestamp: number) => string;
};

export default function DashboardDeadlines({
  formatDeadlineDate,
}: DashboardDeadlinesProps) {
  const { isLoadingDashboardDeadlines, dashboardDeadlines } =
    useDashboardDeadlines();

  return (
    <Card className="p-6 gap-0">
      <CardHeader className="space-y-4 p-0">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Upcoming Deadlines
        </h3>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {isLoadingDashboardDeadlines ? (
          <p className="text-sm text-slate-500">Loading deadlines...</p>
        ) : dashboardDeadlines.length === 0 ? (
          <p className="text-sm text-slate-500">No upcoming deadlines</p>
        ) : (
          dashboardDeadlines.slice(0,6).map((event, index) => (
            <DeadlineItem
              key={index} // Should i use "index" from the .map() instead ?
              title={event.title}
              date={formatDeadlineDate(event.deadline_at)}
              eventType={event.type}
              backgroundColorClassName={
                EVENT_TYPE_TO_STYLINGS[event.type].backgroundColorClassName
              }
            />
          ))
        )}
      </CardContent>
      <CardFooter>
        <Link to="/student/calendar" className="w-full">
          <Button className="w-full cursor-pointer bg-blue-700 hover:brightness-90 mt-4">
            Go To Calendar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
