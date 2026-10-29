import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import api from "@/lib/axios";
import type { MostActiveGroupsStats } from "@/types/admin/stats";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { Bar, XAxis, YAxis, BarChart } from "recharts";
import { toast } from "sonner";

const chartConfig = {
  value: { label: "Value", color: "hsl(210, 85%, 42%)" },
  onTime: { label: "On Time", color: "hsl(170, 65%, 45%)" },
  late: { label: "Late", color: "hsl(45, 90%, 50%)" },
  missing: { label: "Missing", color: "hsl(0, 75%, 55%)" },
  count: { label: "Users", color: "hsl(210, 85%, 42%)" },
  avg: { label: "Average", color: "hsl(170, 65%, 45%)" },
} satisfies ChartConfig;

export const MostActiveChatCard = () => {
  const { data: mostActiveGroupData, isLoading } = useQuery<
    MostActiveGroupsStats[]
  >({
    queryKey: ["most-active-group-stats"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/stats/most-active-groups");
        return res.data;
      } catch {
        toast.error("Error occurred while fetching general statistics.");
      }
    },
  });

  if (isLoading || !mostActiveGroupData) return <>Crying...</>;

  return (
    <Card className="p-6 col-span-2 flex flex-row">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#27BDA4]" />
            <h3 className="font-semibold text-foreground">
              Most Active Chat Groups
            </h3>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Shows groups with highest message volume in selected period.
        </p>

        <ChartContainer config={chartConfig} className="h-[220px]">
          <BarChart data={mostActiveGroupData}>
            <XAxis dataKey="groupName" tick={{ fontSize: 8 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="messageCount" fill="#28BDA4" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="space-y-2 w-full ml-10">
        <p className="text-sm text-muted-foreground font-medium">
          Most messages in a group.
        </p>
        {mostActiveGroupData.map((row, i) => (
          <div
            key={row.groupName}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-teal-100 text-[#28BDA4] rounded-full flex items-center justify-center text-sm font-medium">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{row.groupName}</p>
                <p className="text-xs text-muted-foreground">
                  {row.courseCode} • {"Year " + row.courseYear}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{row.messageCount}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
