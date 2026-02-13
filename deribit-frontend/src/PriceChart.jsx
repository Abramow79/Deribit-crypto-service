import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import PriceHistory from "./PriceHistory";

function PriceChart() {
  const [ticker, setTicker] = useState("btc");
  const [chartData, setChartData] = useState([]);

  // Нормализация данных
  const normalizedData = chartData.map(item => ({
    timestamp: Number(item.timestamp),
    price: Number(item.price)
  }));

  // Последняя и первая цена
  const firstPrice = normalizedData[0]?.price || 0;
  const lastPrice =
    normalizedData[normalizedData.length - 1]?.price || 0;

  const change = lastPrice - firstPrice;
  const changePercent = firstPrice
    ? ((change / firstPrice) * 100).toFixed(2)
    : 0;

  const isUp = change >= 0;

  // Цвет линии
  const lineColor = isUp ? "#22c55e" : "#ef4444";

  // Масштабирование Y
  const prices = normalizedData.map(p => p.price);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  return (
    <div className="w-full max-w-4xl h-[500px] mx-auto mt-8 p-6 bg-gray-900 rounded-xl text-white">

      {/* 🔥 Переключатели */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTicker("btc")}
          className={`px-4 py-2 rounded ${
            ticker === "btc"
              ? "bg-orange-500"
              : "bg-gray-700"
          }`}
        >
          BTC
        </button>

        <button
          onClick={() => setTicker("eth")}
          className={`px-4 py-2 rounded ${
            ticker === "eth"
              ? "bg-blue-500"
              : "bg-gray-700"
          }`}
        >
          ETH
        </button>
      </div>

      {/* 🔥 Цена + изменение */}
      <div className="mb-4">
        <div className="text-3xl font-bold">
          ${lastPrice.toLocaleString()}
        </div>
        <div
          className={`text-lg ${
            isUp ? "text-green-400" : "text-red-400"
          }`}
        >
          {isUp ? "▲" : "▼"} {change.toFixed(2)} (
          {changePercent}%)
        </div>
      </div>

      {/* 🔥 График */}
      <ResponsiveContainer width="100%" height="70%">
        <LineChart
          data={normalizedData}
          margin={{ top: 20, right: 40, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />

          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) =>
              new Date(time * 1000).toLocaleTimeString()
            }
            stroke="#aaa"
          />

          <YAxis
            domain={[min * 0.999, max * 1.001]}
            stroke="#aaa"
          />

          <Tooltip
            contentStyle={{ backgroundColor: "#111" }}
            labelFormatter={(time) =>
              new Date(time * 1000).toLocaleTimeString()
            }
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 🔥 История (получение данных) */}
      <PriceHistory ticker={ticker} onUpdate={setChartData} />
    </div>
  );
}

export default PriceChart;
