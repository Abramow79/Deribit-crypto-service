export default function OrderBook({ ticker }) {
  // Пока фейковые данные
  const bids = Array.from({ length: 10 }, (_, i) => ({
    price: 68000 - i * 5,
    size: Math.random() * 2,
  }));

  const asks = Array.from({ length: 10 }, (_, i) => ({
    price: 68000 + i * 5,
    size: Math.random() * 2,
  }));

  return (
    <div className="p-3">
      <h3 className="font-semibold mb-2">
        {ticker.toUpperCase()} Order Book
      </h3>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <h4 className="text-green-400 mb-1">Bids</h4>
          {bids.map((b, i) => (
            <div key={i} className="flex justify-between">
              <span>{b.price}</span>
              <span>{b.size.toFixed(3)}</span>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-red-400 mb-1">Asks</h4>
          {asks.map((a, i) => (
            <div key={i} className="flex justify-between">
              <span>{a.price}</span>
              <span>{a.size.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
