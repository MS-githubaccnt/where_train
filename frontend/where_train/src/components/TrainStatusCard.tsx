const formatTime = (seconds:number) => {
  if (!seconds || seconds < 0) return "N/A";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let timeStr = "";
  if (days > 0) timeStr += `${days}d `;
  if (hours > 0) timeStr += `${hours}h `;
  if (minutes > 0 || timeStr === "") timeStr += `${minutes}m`;

  return timeStr.trim();
};

const TrainStatusCard = ({ data }:any) => {
  if (!data) return <p>Error loading train data</p>;

  const totalStations = data.station_names.length;
  const curStationIndex = data.upcoming_station_index;
  const nextStationName = data.station_names[curStationIndex] || "Unknown";
  const nextStationSTA = formatTime(data.station_stas[curStationIndex]);
  const progress = curStationIndex > 0 ? (curStationIndex / totalStations) * 100 : 0;

  let statusText = "Next Stop";
  let timeLabel = "Time of Arrival";
  let timeValue = nextStationSTA;

  if (curStationIndex === 0) {
    statusText = "Yet to Start";
    timeLabel = "Time of Start";
    timeValue = formatTime(data.station_stas[0]);
  } else if (curStationIndex === totalStations) {
    statusText = "Arrived at Destination";
    timeLabel = "Time Reached";
    timeValue = formatTime(data.station_stas[totalStations - 1]);
  }

  return (
    <div className="w-60 bg-gray-100 rounded-xl shadow-lg overflow-hidden">
      {/* Train Image */}
      <img 
        src="https://media.istockphoto.com/id/466506979/photo/indian-passenger-train.jpg?s=612x612&w=0&k=20&c=AKcMyvqsam93AnADQaK4hzAMI9bdWOVd8tKoF5Sf10M=" 
        alt="Train"
        className="w-full h-20 object-cover rounded-t-xl"
      />

      <div className="max-h-70 overflow-y-auto p-3">
        {/* Train Info Header */}
        <div className="bg-blue-500 text-white p-2 text-center">
          <h2 className="text-lg font-bold">
            {data.name} ({data.number})
          </h2>
          <p className="text-xs">{data.source} → {data.destination}</p>
        </div>

        <div className="p-2 text-center">
          <h3 className="text-lg font-semibold">{nextStationName}</h3>
          <p className="text-xs text-gray-600">{statusText}</p>
        </div>

        <div className="my-2">
          <div className="w-full bg-gray-300 h-1.5 rounded-lg">
            <div
              className="bg-green-500 h-1.5 rounded-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-1">
            {curStationIndex} / {totalStations} stations covered
          </p>
        </div>

        <div className="bg-gray-200 p-2 rounded-lg text-center">
          <h4 className="text-sm font-semibold text-gray-700">{statusText}</h4>
          <p className="text-xs">{nextStationName}</p>
          <p className="text-xs text-gray-600">
            {timeLabel}: {timeValue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainStatusCard;
