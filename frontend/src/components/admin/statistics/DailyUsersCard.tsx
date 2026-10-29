import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import api from "@/lib/axios";
import type { DailyUsageStats } from "@/types/admin/stats";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Activity } from "lucide-react";
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

export const DailyUsersCard = () => {
  const { data: dailyStats, isLoading } = useQuery<DailyUsageStats>({
    queryKey: ["daily-usage-stats"],
    queryFn: async () => {
      try {
        const { data } = await api.get<DailyUsageStats>(
          "/api/stats/daily-users-usage"
        );

        return {
          ...data,
          dailyUsage: data.dailyUsage.map((day) => ({
            ...day,
            sessionDate: format(parseISO(day.sessionDate), "MMM d"),
          })),
        };
      } catch {
        toast.error("Error occurred while fetching general statistics.");
        return {
          dailyUsage: [],
          avg_30_days: 0,
          avg_7_days: 0,
        } as DailyUsageStats;
      }
    },
  });

  if (isLoading || !dailyStats) return <>Crying...</>;
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-foreground">Daily Active Users</h3>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div>
          <p className="text-3xl font-bold text-foreground">
            {dailyStats.dailyUsage.at(-1)?.userCount}
          </p>
          <p className="text-sm text-muted-foreground">Today</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Active users are unique users with at least one recorded action that
        day.
      </p>
      <ChartContainer config={chartConfig} className="h-[250px]">
        <AreaChart data={dailyStats.dailyUsage}>
          <defs>
            <linearGradient id="gradientStroke" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(210, 85%, 42%)"
                stopOpacity={0.6}
              />
              <stop
                offset="95%"
                stopColor="hsl(210, 85%, 42%)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sessionDate" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="userCount"
            stroke="hsl(210, 85%, 42%)"
            strokeWidth={2}
            fill="url(#gradientStroke)"
          />
        </AreaChart>
      </ChartContainer>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-lg font-bold">{dailyStats.avg_7_days}</p>
          <p className="text-xs text-muted-foreground">7-day avg</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-lg font-bold">{dailyStats.avg_30_days}</p>
          <p className="text-xs text-muted-foreground">30-day avg</p>
        </div>
      </div>
    </Card>
  );
};
