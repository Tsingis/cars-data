import React, { useRef, useEffect } from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { type Count } from "../../types"

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, PieController)

type PieChartProps = {
  data: Count
  labelMap?: { [key: string]: string }
  colorMap?: { [key: string]: string }
  title?: string
  legendPosition?: "top" | "bottom" | "left" | "right"
  className?: string
  style?: React.CSSProperties
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  labelMap = {},
  colorMap = {},
  title,
  legendPosition = "bottom",
  className,
  style,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<ChartJS<"pie"> | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        const labels = Object.keys(data).map((key) => labelMap[key] || key)
        const values = Object.values(data)
        const total = values.reduce(
          (sum, value) => (sum ?? 0) + (value ?? 0),
          0
        )

        const defaultColor = "rgba(0, 123, 255, 0.6)"
        const backgroundColors = Object.keys(data).map(
          (key) => colorMap[key] || defaultColor
        )

        const chartData: ChartData<"pie", number[], string> = {
          labels,
          datasets: [
            {
              data: values.filter((x) => x !== undefined),
              backgroundColor: backgroundColors,
              borderColor: "rgb(223, 220, 220)",
              borderWidth: 2,
            },
          ],
        }

        const chartOptions: ChartOptions<"pie"> = {
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
              padding: {
                top: 10,
              },
            },
            legend: {
              display: true,
              position: legendPosition,
              align: "center",
              labels: {
                usePointStyle: true,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || ""
                  const value = context.raw as number
                  const percentage = ((value / (total ?? 1)) * 100).toFixed(2)
                  return `${label}: ${value} (${percentage}%)`
                },
              },
            },
          },
        }

        chartInstanceRef.current = new ChartJS(ctx, {
          type: "pie",
          data: chartData,
          options: chartOptions,
        })

        chartInstanceRef.current?.update()
      }
    }

    return () => {
      chartInstanceRef.current?.destroy()
    }
  }, [data, labelMap, colorMap, title, legendPosition])

  return (
    <div className={`${className}`} style={style}>
      <canvas ref={chartRef} />
    </div>
  )
}

export default PieChart
