import {
  BarController,
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import type React from "react";
import { useEffect, useRef } from "react";
import type { Count } from "../../types";

// Register necessary Chart.js components
ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
);

type BarChartProps = {
  data: Count;
  xAxisLabelMap?: { [key: string]: string };
  colorMap?: { [key: string]: string };
  xAxisText?: string;
  yAxisText?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisLabelMap = {},
  colorMap = {},
  xAxisText = "",
  yAxisText = "Amount",
  title,
  className,
  style,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS<"bar"> | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        const labels = Object.keys(data).map(
          (key) => xAxisLabelMap[key] ?? key
        );
        const values = Object.values(data);
        const total = values.reduce(
          (sum, value) => (sum ?? 0) + (value ?? 0),
          0
        );

        const defaultColor = "rgba(0, 123, 255, 0.6)";
        const backgroundColors = Object.keys(data).map(
          (label) => colorMap[label] ?? defaultColor
        );

        const chartData: ChartData<"bar", number[], string> = {
          labels,
          datasets: [
            {
              label: "Count",
              data: values.filter((x) => x !== undefined),
              backgroundColor: backgroundColors,
            },
          ],
        };

        const chartOptions: ChartOptions<"bar"> = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: !!title,
              text: title,
              position: "top",
              color: "grey",
              font: {
                family: "Arial, sans-serif",
                weight: "bold",
              },
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label ?? "";
                  const value = context.raw as number;
                  const percentage = ((value / (total ?? 1)) * 100).toFixed(2);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: !!xAxisText,
                text: xAxisText,
              },
              grid: {
                display: false,
              },
              ticks: {
                autoSkip: false,
              },
            },
            y: {
              title: {
                display: !!yAxisText,
                text: yAxisText,
              },
              ticks: {
                callback: (value) => value,
              },
            },
          },
        };

        chartInstanceRef.current = new ChartJS(ctx, {
          type: "bar",
          data: chartData,
          options: chartOptions,
        });

        chartInstanceRef.current?.update();
      }
    }

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [data, xAxisLabelMap, xAxisText, yAxisText, title, colorMap]);

  return (
    <div data-testid="barchart" className={`${className}`} style={style}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default BarChart;
