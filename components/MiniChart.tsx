import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AdminService, ChartDataPoint, ChartPeriod } from "@/lib/adminService";
import { useCallback, useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface MiniChartProps {
  type: "revenue" | "orders";
  className?: string;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  orders: {
    label: "Orders",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function MiniChart({ type, className }: MiniChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [period, setPeriod] = useState<ChartPeriod>("month");
  const [loading, setLoading] = useState(true);

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AdminService.getChartData(period);
      const displayData = period === "month" ? data.slice(-6) : data.slice(-7); // 6 months or 7 days
      setChartData(displayData);
    } catch (error) {
      console.error("Error fetching mini chart data:", error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  if (loading || chartData.length === 0) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">Last {period === "month" ? "6 months" : "7 days"}</p>
          <div className="flex gap-1">
            <Button
              variant={period === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("day")}
              className="h-5 px-2 text-xs"
            >
              Day
            </Button>
            <Button
              variant={period === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("month")}
              className="h-5 px-2 text-xs"
            >
              Month
            </Button>
          </div>
        </div>
        <div className="h-20 w-full">
          <div className="flex h-full items-center justify-center">
            <div className="h-3 w-3 animate-spin rounded-full border-b border-current opacity-50"></div>
          </div>
        </div>
      </div>
    );
  }

  const dataKey = type === "revenue" ? "revenue" : "orders";

  // Format date for display
  const formatLabel = (dateString: string) => {
    if (period === "day") {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      const [year, month] = dateString.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString("en-US", { month: "short" });
    }
  };

  // Add formatted labels to chart data and rename the data key to match chart config
  const formattedData = chartData.map((item) => ({
    label: formatLabel(item.date),
    [type]: item[dataKey], // Use 'revenue' or 'orders' as the key
  }));

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">Last {period === "month" ? "6 months" : "7 days"}</p>
        <div className="flex gap-1">
          <Button
            variant={period === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("day")}
            className="h-5 px-2 text-xs"
            disabled={loading}
          >
            Day
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("month")}
            className="h-5 px-2 text-xs"
            disabled={loading}
          >
            Month
          </Button>
        </div>
      </div>
      <div className="h-20 w-full">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 9, fill: "currentColor" }}
              interval={0}
              angle={period === "day" ? -45 : 0}
              textAnchor={period === "day" ? "end" : "middle"}
              tickFormatter={(value) => (period === "month" ? value.slice(0, 3) : value)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey={type}
              type="natural"
              stroke={`var(--color-${type})`}
              strokeWidth={2}
              dot={{
                fill: `var(--color-${type})`,
                strokeWidth: 2,
                r: 3,
              }}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: "#fff",
              }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
