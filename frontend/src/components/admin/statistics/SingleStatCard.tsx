import { Card } from "@/components/ui/card";

export const SingleStatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
}) => (
  <Card className={`p-4 hover:shadow-md transition-shadow`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  </Card>
);
