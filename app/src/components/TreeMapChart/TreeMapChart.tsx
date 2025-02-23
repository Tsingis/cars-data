import React, { useRef, useEffect } from "react"
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js"
import {
  TreemapController,
  TreemapElement,
  TreemapDataPoint,
} from "chartjs-chart-treemap"
import { Count } from "../../types"
import "./TreeMapChart.modules.css"

// Register necessary Chart.js components
ChartJS.register(TreemapController, TreemapElement, Tooltip, Legend)

type TreeMapChartProps = {
  data: Count
  labelMap?: { [key: string]: string }
  colorMap?: { [key: string]: string }
  title?: string
  className?: string
  style?: React.CSSProperties
}

const TreeMapChart: React.FC<TreeMapChartProps> = ({
  data,
  labelMap = {},
  colorMap = {},
  title,
  className,
  style,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<ChartJS<"treemap"> | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        const labels = Object.keys(data).map((key) => labelMap[key] || key)
        const values = Object.values(data).map((value) => value ?? 0)
        const total = values.reduce(
          (sum, value) => (sum ?? 0) + (value ?? 0),
          0
        )

        const treeData = labels.map((label, index) => ({
          category: label,
          value: values[index],
        }))

        const chartData: ChartData<"treemap", TreemapDataPoint[], string> = {
          datasets: [
            {
              label: "Count",
              tree: treeData,
              key: "value",
              groups: ["category"],
              data: [], // REQUIRED: Even though `tree` will generate it, Chart.js expects this field
              backgroundColor: (context) => {
                if (context.type !== "data") return "transparent"
                const raw = context.raw as TreemapDataPoint & {
                  category: string
                }
                const label = raw.g || ""
                const color = colorMap[label] || "rgba(0, 123, 255, 0.6)"
                return color
              },
              borderColor: "rgb(223, 220, 220)",
              borderWidth: 2,
              labels: {
                display: true,
                formatter: (ctx) => {
                  const raw = ctx.raw as TreemapDataPoint & { category: string }
                  const value = raw.v
                  return value.toString()
                },
                color: "black",
                font: {
                  size: 12,
                },
              },
            },
          ],
        }

        const chartOptions: ChartOptions<"treemap"> = {
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
              display: false,
            },
            tooltip: {
              callbacks: {
                title: function (context) {
                  const raw = context[0].raw as TreemapDataPoint
                  return raw.g || ""
                },
                label: function (context) {
                  const raw = context.raw as TreemapDataPoint
                  const label = raw.g || ""
                  const value = raw.v
                  const percentage = ((value / (total ?? 1)) * 100).toFixed(2)
                  return `${label}: ${value} (${percentage}%)`
                },
              },
            },
          },
        }

        chartInstanceRef.current = new ChartJS(ctx, {
          type: "treemap",
          data: chartData,
          options: chartOptions,
        })

        chartInstanceRef.current?.update()
      }
    }

    return () => {
      chartInstanceRef.current?.destroy()
    }
  }, [data, labelMap, colorMap, title])

  return (
    <div className={`treemapchart-container ${className}`} style={style}>
      <canvas ref={chartRef} />
    </div>
  )
}

export default TreeMapChart
