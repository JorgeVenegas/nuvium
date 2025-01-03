"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { StorageSpaceDetails } from "@/types";
import { convertFileSize } from "@/lib/utils";

interface MainSpaceChartProps {
  storageDetails: StorageSpaceDetails;
}

export function MainSpaceChart({
  storageDetails: { total, available, used, usedPercentage, byType },
}: MainSpaceChartProps) {
  const chartData = [
    { tag: "space", used: Math.max(used, total * 0.02), available },
  ];

  const chartConfig = {
    available: {},
    used: {},
  } satisfies ChartConfig;
  return (
    <Card className="bg-brand">
      <CardContent className="flex flex-col sm:flex-row p-8 justify-center gap-8">
        <ChartContainer
          config={chartConfig}
          className="sm:m-0 mx-auto min-h-[200px] w-[200px] h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={245}
            endAngle={-65}
            innerRadius={90}
            outerRadius={140}
            className="m-0 p-0 h-full w-full"
          >
            <RadialBar
              dataKey="used"
              stackId="a"
              fill="white"
              cornerRadius={5}
              background={{ fill: "hsla(0, 0%, 100%, 0.2)", opacity: 0.1 }}
            />
            <RadialBar
              dataKey="available"
              stackId="a"
              fill="hsla(0, 100%, 50%, 0)"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-4xl font-bold"
                        >
                          {usedPercentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 32}
                          className="fill-white text-lg font-semibold"
                        >
                          Space used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
        <div className="flex flex-col justify-center gap-2 items-center sm:items-start">
          <h2 className="h2 text-white font-bold">Available Storage</h2>
          <span className="subtitle-1 text-muted text-md">
            {convertFileSize(used)}/{convertFileSize(total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
