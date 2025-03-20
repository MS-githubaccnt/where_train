import  { useState, useEffect } from "react";

const StationCard = ({ trains }) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeInSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function getCurrentTimeInSeconds() {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  }

  function formatTimeDiff(sta) {
    const diff = sta - currentTime;
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / 3600);
    const minutes = Math.floor((absDiff % 3600) / 60);
    const seconds = absDiff % 60;

    let timeString = `${hours}h ${minutes}m ${seconds}s`;
    return diff >= 0 ? `Arriving in ${timeString}` : `Departed ${timeString} ago`;
  }

  return (
    <div className="w-full md:w-1/2 max-h-96 overflow-y-auto p-2 bg-white shadow-lg rounded-2xl border border-gray-300">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Train Schedule</h2>
        <div className="space-y-3">
          {trains.map((train, index) => (
            <div key={index} className="border p-3 rounded-lg shadow-sm bg-gray-100">
              <p className="font-bold">{train.name} ({train.number})</p>
              <p className="text-sm text-blue-600">{formatTimeDiff(train.sta)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StationCard;
