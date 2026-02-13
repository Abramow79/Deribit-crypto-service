import { useEffect, useState } from "react";

function PriceHistory({ ticker, onUpdate }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

/*   const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/prices?ticker=${ticker}`);
      const data = await res.json();

      // Сортировка по времени, последние 10 значений
      const sorted = data
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

      setHistory(sorted);

      // Отправляем данные наверх через callback, если он есть
      if (onUpdate) onUpdate(sorted);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  }; */

  const fetchHistory = async () => {
  setLoading(true);
  try {
    const res = await fetch(`http://localhost:8000/prices?ticker=${ticker}`);
    const data = await res.json();

    const normalized = data.map(item => ({
      timestamp: Number(item.timestamp),
      price: Number(item.price)
    }));

    const uniqueMap = new Map();
    normalized.forEach(item => {
      uniqueMap.set(item.timestamp, item);
    });

    const unique = Array.from(uniqueMap.values());

    const sorted = unique
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-20);

    setHistory(sorted);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 60000); // обновление каждую минуту
    return () => clearInterval(interval);
  }, [ticker]);

  const getColor = (current, previous) => {
    if (previous === undefined) return "text-gray-300";
    return current > previous
      ? "text-green-400"
      : current < previous
      ? "text-red-400"
      : "text-gray-300";
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">{ticker.toUpperCase()} Price History</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-700 text-gray-200">
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="2" className="text-center p-4">Loading...</td>
            </tr>
          ) : history.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center p-4">No data</td>
            </tr>
          ) : (
            history.map((item, index) => {
              const prevPrice = history[index + 1]?.price;
              return (
                <tr key={item.timestamp} className="border-b border-gray-600">
                  <td className="p-2">{new Date(item.timestamp * 1000).toLocaleTimeString()}</td>
                  <td className={`p-2 text-right font-medium ${getColor(item.price, prevPrice)}`}>
                    {item.price}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PriceHistory;
