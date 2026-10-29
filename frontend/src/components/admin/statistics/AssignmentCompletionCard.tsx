import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import api from "@/lib/axios";
import type { AssignmentCompletionStats } from "@/types/admin/stats";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const chartConfig = {
  value: { label: "Value", color: "hsl(210, 85%, 42%)" },
  onTime: { label: "On Time", color: "hsl(170, 65%, 45%)" },
  late: { label: "Late", color: "hsl(45, 90%, 50%)" },
  missing: { label: "Missing", color: "hsl(0, 75%, 55%)" },
  count: { label: "Users", color: "hsl(210, 85%, 42%)" },
  avg: { label: "Average", color: "hsl(170, 65%, 45%)" },
} satisfies ChartConfig;

export const AssignmentCompletionCard = () => {
  const { data: assignmentCompletionData, isLoading } = useQuery<
    AssignmentCompletionStats[]
  >({
    queryKey: ["assignment-completion-rate"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/stats/assignment-completion-rate");
        return res.data;
      } catch {
        toast.error("Error occurred while fetching general statistics.");
      }
    },
  });

  if (isLoading || !assignmentCompletionData) return <>Crying...</>;

  return (
    <Card className="p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <h3 className="font-semibold text-foreground">
            Assignment Completion Rate
          </h3>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Completion rate shows proportion of expected student submissions
        completed by the deadline.
      </p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-teal-500"></div>
          <span className="text-xs text-muted-foreground">On Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-yellow-500"></div>
          <span className="text-xs text-muted-foreground">Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-400"></div>
          <span className="text-xs text-muted-foreground">Missing</span>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[200px] w-[800px]">
        <BarChart data={assignmentCompletionData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={80} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="onTime"
            stackId="a"
            fill="hsl(170, 65%, 45%)"
            radius={[0, 0, 0, 0]}
          />
          <Bar dataKey="late" stackId="a" fill="hsl(45, 90%, 50%)" />
          <Bar
            dataKey="missing"
            stackId="a"
            fill="hsl(0, 75%, 65%)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Course</th>
              <th className="text-right py-2 font-medium">Assigned</th>
              <th className="text-right py-2 font-medium">On Time</th>
              <th className="text-right py-2 font-medium">Late</th>
              <th className="text-right py-2 font-medium">Completion</th>
            </tr>
          </thead>
          <tbody>
            {assignmentCompletionData.map((item) => (
              <tr key={item.code} className="border-b last:border-0">
                <td className="py-2">
                  {item.code}: {item.name}
                </td>
                <td className="text-right">{item.assigned}</td>
                <td className="text-right text-teal-600">{item.onTime}</td>
                <td className="text-right text-yellow-600">{item.late}</td>
                <td className="text-right font-medium">
                  {item.completionRate.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
