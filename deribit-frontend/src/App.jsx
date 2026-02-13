import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
} from "recharts";

function TradingChart({ ticker, timeframe }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/prices?ticker=${ticker}`);
      const raw = await res.json();

      const unique = Array.from(
        new Map(raw.map((i) => [i.timestamp, i])).values()
      );

      const sorted = unique.sort((a, b) => a.timestamp - b.timestamp);

      // 🔥 Группировка под таймфрейм
      const grouped = [];
      let bucket = [];

      const interval =
        timeframe === "1m" ? 60 :
        timeframe === "5m" ? 300 :
        900;

      for (let i = 0; i < sorted.length; i++) {
        bucket.push(sorted[i]);

        if (
          bucket.length > 1 &&
          sorted[i].timestamp - bucket[0].timestamp >= interval
        ) {
          const open = bucket[0].price;
          const close = bucket[bucket.length - 1].price;
          const high = Math.max(...bucket.map((b) => b.price));
          const low = Math.min(...bucket.map((b) => b.price));

          grouped.push({
            timestamp: bucket[0].timestamp,
            open,
            close,
            high,
            low,
          });

          bucket = [];
        }
      }

      setData(grouped.slice(-40));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [ticker, timeframe]);

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ComposedChart data={data}>
        <CartesianGrid stroke="#444" />

        <XAxis
          dataKey="timestamp"
          tickFormatter={(t) =>
            new Date(t * 1000).toLocaleTimeString()
          }
          stroke="#aaa"
        />

        <YAxis stroke="#aaa" domain={["auto", "auto"]} />

        <Tooltip
          labelFormatter={(label) =>
            new Date(label * 1000).toLocaleTimeString()
          }
        />

        {/* Свечи */}
        <Bar
          dataKey="high"
          fill="#8884d8"
          shape={(props) => {
            const { x, y, width, height, payload } = props;
            const color =
              payload.close >= payload.open ? "#22c55e" : "#ef4444";

            return (
              <rect
                x={x + width / 4}
                y={y}
                width={width / 2}
                height={height}
                fill={color}
              />
            );
          }}
        />

        {/* Линия закрытия */}
        <Line
          type="monotone"
          dataKey="close"
          stroke="#60a5fa"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default function App() {
  const [ticker, setTicker] = useState("btc");
  const [timeframe, setTimeframe] = useState("1m");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-6">

      <h1 className="text-4xl font-bold text-center">
        Crypto Trading Terminal
      </h1>

      {/* TICKER SWITCH */}
      <div className="flex justify-center gap-4">
        {["btc", "eth"].map((t) => (
          <button
            key={t}
            onClick={() => setTicker(t)}
            className={`px-6 py-2 rounded-lg font-semibold ${
              ticker === t
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TIMEFRAME */}
      <div className="flex justify-center gap-4">
        {["1m", "5m", "15m"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-1 rounded ${
              timeframe === tf
                ? "bg-green-600"
                : "bg-gray-700"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div className="w-full max-w-6xl mx-auto bg-gray-800 p-4 rounded-xl">
        <TradingChart ticker={ticker} timeframe={timeframe} />
      </div>
    </div>
  );
}

// import { useState } from "react";
// import TradingChart from "./TradingChart";
// import OrderBook from "./OrderBook";
// import Trades from "./Trades";

// export default function App() {
//   const [ticker, setTicker] = useState("btc");

//   return (
//     <div className="h-screen bg-gray-950 text-white flex flex-col">

//       {/* HEADER */}
//       <div className="bg-gray-900 px-6 py-3 flex justify-between items-center border-b border-gray-800">
//         <h1 className="text-xl font-bold">Crypto Terminal</h1>

//         <div className="flex gap-3">
//           {["btc", "eth"].map((t) => (
//             <button
//               key={t}
//               onClick={() => setTicker(t)}
//               className={`px-4 py-1 rounded ${
//                 ticker === t
//                   ? "bg-blue-600"
//                   : "bg-gray-700 hover:bg-gray-600"
//               }`}
//             >
//               {t.toUpperCase()}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MAIN */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* CHART AREA */}
//         <div className="flex-1 p-4">
//           <TradingChart ticker={ticker} />
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">

//           <div className="flex-1 overflow-auto">
//             <OrderBook ticker={ticker} />
//           </div>

//           <div className="flex-1 overflow-auto border-t border-gray-800">
//             <Trades ticker={ticker} />
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }

