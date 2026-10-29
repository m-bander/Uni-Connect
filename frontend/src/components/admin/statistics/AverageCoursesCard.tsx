import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import api from "@/lib/axios";
import type { AverageCourseStats } from "@/types/admin/stats";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const chartConfig = {
  value: { label: "Value", color: "hsl(210, 85%, 42%)" },
  onTime: { label: "On Time", color: "hsl(170, 65%, 45%)" },
  late: { label: "Late", color: "hsl(45, 90%, 50%)" },
  missing: { label: "Missing", color: "hsl(0, 75%, 55%)" },
  count: { label: "Users", color: "hsl(210, 85%, 42%)" },
  avg: { label: "Average", color: "hsl(170, 65%, 45%)" },
} satisfies ChartConfig;

export const AverageCoursesCard = () => {
  const { data: averageCourseData, isLoading } = useQuery<AverageCourseStats[]>(
    {
      queryKey: ["average-course-grade"],
      queryFn: async () => {
        try {
          const res = await api.get("/api/stats/average-course-grades");
          return res.data;
        } catch {
          toast.error("Error occurred while fetching general statistics.");
        }
      },
    }
  );

  if (isLoading || !averageCourseData) return <>Crying...</>;
  return (
    <Card className="p-6 col-span-1">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-foreground">
            Average Grades by Course
          </h3>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Average grade across graded submissions.
      </p>
      <div className="flex items-center justify-center h-full">
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart data={averageCourseData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="courseCode" type="category" width={60} />
            <ChartTooltip content={<ChartTooltipContent label={"Avg"} />} />
            <Bar
              dataKey="averageGrade"
              name="Grade%"
              fill="hsl(210, 85%, 42%)"
              radius={4}
            >
              {averageCourseData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.averageGrade >= 80
                      ? "hsl(170, 65%, 45%)"
                      : entry.averageGrade >= 70
                        ? "hsl(210, 85%, 42%)"
                        : "hsl(45, 90%, 50%)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
};
