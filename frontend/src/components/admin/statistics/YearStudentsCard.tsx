import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import api from "@/lib/axios";
import type { StudentsByYearStats } from "@/types/admin/stats";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import { toast } from "sonner";

const chartConfig = {
  students: {
    label: "Students",
  },
  year1: {
    label: "First Year",
    color: "#8EC5FF",
  },
  year2: {
    label: "Second Year",
    color: "#193CB8",
  },
  year3: {
    label: "Third Year",
    color: "#1447E6",
  },
  year4: {
    label: "Fourth Year",
    color: "#155DFC",
  },
  year5: {
    label: "Fifth Year",
    color: "#2B7FFF",
  },
} satisfies ChartConfig;

export const YearStudentsCard = () => {
  const { data: studentsPerYearData, isLoading } = useQuery<
    StudentsByYearStats[]
  >({
    queryKey: ["students-by-year"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/stats/students-by-year");
        return res.data;
      } catch {
        toast.error(
          "Error occurred while fetching students by year statistics."
        );
      }
    },
  });

  console.log("DATA: ", studentsPerYearData);

  if (isLoading || !studentsPerYearData) return <>Crying...</>;

  return (
    <Card className="p-6 col-span-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-foreground">
            Students in each year
          </h3>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Student distribution across academic years.
      </p>
      <div className="mt-auto">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[350px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={studentsPerYearData}
              dataKey="students"
              nameKey="yearType"
            >
              {studentsPerYearData.map((entry) => (
                <Cell
                  key={entry.yearType}
                  fill={chartConfig[entry.yearType].color}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="yearType" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </div>
    </Card>
  );
};
