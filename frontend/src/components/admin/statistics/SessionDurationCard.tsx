import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import api from "@/lib/axios";
import type { SessionDurationStats } from "@/types/admin/stats";
import {
  msToReadable,
  msToReadableShortened,
} from "@/utils/time/ms-to-readable";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Timer } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const chartConfig = {
  value: { label: "Value", color: "hsl(210, 85%, 42%)" },
  onTime: { label: "On Time", color: "hsl(170, 65%, 45%)" },
  late: { label: "Late", color: "hsl(45, 90%, 50%)" },
  missing: { label: "Missing", color: "hsl(0, 75%, 55%)" },
  count: { label: "Users", color: "hsl(210, 85%, 42%)" },
  avg: { label: "Average", color: "hsl(170, 65%, 45%)" },
};

export const SessionDurationCard = () => {
  const { data: sessionData, isLoading } = useQuery<SessionDurationStats>({
    queryKey: ["session-duration-stats"],
    queryFn: async () => {
      try {
        const { data } = await api.get<SessionDurationStats>(
          "/api/stats/session-duration"
        );

        return {
          ...data,
          sessionStats: data.sessionStats.map((day) => ({
            ...day,
            sessionDate: format(parseISO(day.sessionDate), "MMM d"),
          })),
        };
      } catch (err) {
        console.log(err);
        toast.error("Error occurred while fetching general statistics.");
        return {
          sessionStats: [],
          overallAverage: 0,
        } as SessionDurationStats;
      }
    },
  });

  if (isLoading || !sessionData) return <>Crying...</>;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-foreground">Session Duration</h3>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div>
          <p className="text-3xl font-bold text-foreground">
            {!sessionData.sessionStats.at(-1)
              ? "Not recorded"
              : msToReadable(
                  sessionData.sessionStats.at(-1)?.averageDuration as number
                )}
          </p>
          <p className="text-sm text-muted-foreground">
            Today session time average
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Average duration of user activity per session.
      </p>
      <ChartContainer config={chartConfig} className="h-[250px]">
        <AreaChart data={sessionData.sessionStats}>
          <defs>
            <linearGradient id="gradientStroke" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="35%"
                stopColor="hsl(210, 85%, 42%)"
                stopOpacity={1}
              />
              <stop
                offset="95%"
                stopColor="hsl(210, 85%, 42%)"
                stopOpacity={1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sessionDate" tick={{ fontSize: 10 }} />

          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(value: number) => msToReadableShortened(value)}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number, _, item) => {
              return (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-[2px]"
                    style={{ backgroundColor: item.color || item.payload.fill }}
                  />
                  <span className="font-semibold text-foreground">
                    {msToReadableShortened(value)}
                  </span>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            name="AVG"
            dataKey="averageDuration"
            stroke="hsl(210, 85%, 42%)"
            strokeWidth={2}
            fill="url(#gradientStroke)"
          />
        </AreaChart>
      </ChartContainer>

      <div className="text-center p-3 bg-muted/50 rounded-lg">
        <p className="text-lg font-bold">
          {msToReadable(sessionData.overallAverage)}
        </p>
        <p className="text-xs text-muted-foreground">
          Overall average user session
        </p>
      </div>
    </Card>
  );
};
