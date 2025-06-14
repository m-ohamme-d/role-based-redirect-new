
import { ArrowDown, ArrowUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface DepartmentCardProps {
  id: number;
  name: string;
  employeeCount: number;
  growth: string;
  trend: "up" | "down" | "neutral";
}

const trendColor = {
  up: "text-green-600",
  down: "text-red-600",
  neutral: "text-gray-500",
};

const bgColors = [
  "bg-blue-50",
  "bg-green-50",
  "bg-yellow-50",
  "bg-violet-50",
  "bg-orange-50",
];

export default function DepartmentCard({
  id,
  name,
  employeeCount,
  growth,
  trend,
}: DepartmentCardProps) {
  // Deterministically pick a bg color based on hash of name/id
  const bgClass = bgColors[id % bgColors.length];

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${bgClass}`}>
      <CardContent className="p-4 flex flex-col gap-2">
        <Link to={`/manager/department/${id}`}>
          <div className="flex gap-2 items-center">
            <div className="rounded-full bg-white shadow p-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-base">{name}</h3>
          </div>
          <p className="text-sm text-gray-600 ml-10">{employeeCount} employees</p>
        </Link>
        <div className={`flex items-center gap-1 ml-10 font-medium ${trendColor[trend]}`}>
          {growth}
          {trend === "up" && <ArrowUp size={16} className="ml-1 text-green-600" />}
          {trend === "down" && <ArrowDown size={16} className="ml-1 text-red-600" />}
        </div>
      </CardContent>
    </Card>
  );
}
