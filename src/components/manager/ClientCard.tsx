
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface ClientCardProps {
  client: any;
  onClick: (client: any) => void;
}

const statusColors = {
  working: "bg-green-500",
  stopped: "bg-red-500"
};

export default function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-sky-400"
      onClick={() => onClick(client)}
      tabIndex={0}
      role="button"
    >
      <CardContent className="p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="relative w-3 h-3 flex items-center justify-center">
            <span className={`absolute rounded-full w-3 h-3 opacity-80 ${client.status === "working" ? "bg-green-400 animate-pulse" : "bg-red-400 animate-pulse"}`} />
          </span>
          <h3 className="font-semibold text-lg">{client.name}</h3>
        </div>
        <p className="text-sm text-gray-600">{client.company}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant={client.status === "working" ? "default" : "destructive"}
            className={statusColors[client.status]}
          >
            {client.status === "working" ? "Working" : "Stopped"}
          </Badge>
          <Eye className="h-4 w-4 text-sky-500 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}
