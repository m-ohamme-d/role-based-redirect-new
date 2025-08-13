import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { goToExport } from "@/lib/downloads";

type Filters = Record<string, any>;
type Meta = { type?: string; role?: string; filters?: Filters };

type Props =
  | { rows: any[]; meta?: Meta; label?: string; disabled?: boolean }
  | { getRows: () => any[]; meta?: Meta; label?: string; disabled?: boolean };

export default function GenerateReportButton(props: Props) {
  const navigate = useNavigate();

  // Support either {rows} or {getRows}
  const rows: any[] = useMemo(() => {
    // @ts-ignore – runtime guard
    return "getRows" in props ? props.getRows()?.slice?.() ?? [] : (props as any).rows ?? [];
  }, [props]);

  const label = (props as any).label ?? "Export";
  const disabled = (props as any).disabled ?? rows.length === 0;

  const onClick = () => {
    // sanity log (remove later)
    console.log("rows ->", rows?.length, rows?.slice(0, 2));
    goToExport(navigate, rows, (props as any).meta);
  };

  return (
    <Button type="button" onClick={onClick} disabled={disabled} title={disabled ? "No rows to export" : ""}>
      {label}
    </Button>
  );
}