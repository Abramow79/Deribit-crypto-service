export default function Trades({ ticker }) {
  const trades = Array.from({ length: 15 }, (_, i) => ({
    price: 68000 + Math.random() * 100 - 50,
    size: Math.random(),
    side: Math.random() > 0.5 ? "buy" : "sell",
  }));

  return (
    <div className="p-3">
      <h3 className="font-semibold mb-2">
        {ticker.toUpperCase()} Trades
      </h3>

      <div className="text-sm space-y-1">
        {trades.map((t, i) => (
          <div
            key={i}
            className={`flex justify-between ${
              t.side === "buy"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            <span>{t.price.toFixed(2)}</span>
            <span>{t.size.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
