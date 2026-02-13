import PriceChart from "./PriceChart";

function TradingChart({ ticker }) {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-full max-w-5xl h-[500px] bg-white rounded-xl shadow p-4">
        <PriceChart ticker={ticker} />
      </div>
    </div>
  );
}

export default TradingChart;
