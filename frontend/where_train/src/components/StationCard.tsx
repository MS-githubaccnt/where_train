import { useState, useEffect } from "react";

const StationCard = ({ trains }) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInSeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeInSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Returns seconds elapsed since today's midnight.
  function getCurrentTimeInSeconds() {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  }

  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  // We assume `sta` is seconds since today's midnight.
  // Calculate the full arrival Date manually.
  function formatTimeDiff(sta) {
    const now = new Date();
    // Today's midnight as a Date object.
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Add sta seconds (converted to ms) to midnight.
    const trainDate = new Date(midnight.getTime() + sta * 1000);

    // Extract date parts.
    const day = trainDate.getDate();
    const month = trainDate.getMonth() + 1; // Months are zero-based.
    const year = trainDate.getFullYear();

    // Extract hours and minutes.
    const hours = trainDate.getHours();
    const minutes = trainDate.getMinutes();

    // Create formatted strings.
    const formattedDate = `${pad(day)}/${pad(month)}/${year}`;
    const formattedTime = `${pad(hours)}:${pad(minutes)}`;

    // Compare train time (sta) to current time in seconds from midnight.
    const diff = sta - currentTime;
    return {
      text: diff >= 0
        ? `Arriving on ${formattedDate} at ${formattedTime}`
        : `Departed on ${formattedDate} at ${formattedTime}`,
      isArriving: diff >= 0
    };
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-2xl border border-gray-300 transition-all duration-300">
      <div className="p-2">
        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800 text-center">
          🚆 Train Schedule
        </h2>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {trains.map((train, index) => {
            const { text, isArriving } = formatTimeDiff(train.sta);
            return (
              <div
                key={index}
                className={`border p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  isArriving ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"
                }`}
              >
                <p className="font-bold text-gray-900 text-sm md:text-base">
                  {train.name} ({train.number})
                </p>
                <p className={`text-xs md:text-sm font-medium ${isArriving ? "text-green-600" : "text-red-600"}`}>
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StationCard;
