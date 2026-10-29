import { Card, CardHeader } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  isLoading: boolean;
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  color,
  isLoading,
}: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow p-6 gap-0">
      <CardHeader className="p-0 mb-0">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 bg-linear-to-br ${color} rounded-xl flex items-center justify-center`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">
              {isLoading ? "..." : value}
            </p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
