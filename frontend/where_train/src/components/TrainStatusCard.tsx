import React from "react";
//modify this
const TrainStatusCard=({data}:any)=>{
  console.log("trian data");
  console.log(data);
if (!data||!data.success)return<p>Error loading train data</p>;
  return (
    <div className="w-full md:w-full lg:w-full  bg-gray-100 rounded-xl shadow-lg p-4 ">
      <div className="bg-blue-500 text-white p-2 rounded-t-xl text-center">
        <h2 className="text-lg font-bold">{data.train_name} ({data.train_number})</h2>
        <p className="text-sm">{data.source_stn_name} → {data.dest_stn_name}</p>
      </div>
      <div className="p-3 text-center">
        <h3 className="text-xl font-semibold">{data.current_station_name.replace("~", "")}</h3>
        <p className="text-sm text-gray-600">{data.status_as_of}</p>
        <p className="text-sm text-gray-800">
          Platform: <span className="font-bold">{data.platform_number}</span>
        </p>
      </div>
      <div className="flex justify-between bg-white p-2 rounded-lg shadow-sm">
        <div className="text-center">
          <p className="text-sm text-gray-500">Scheduled</p>
          <p className="font-bold">{data.cur_stn_sta}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Estimated</p>
          <p className="font-bold text-red-500">{data.eta}</p>
        </div>
      </div>
      <div className="my-3">
        <div className="w-full bg-gray-300 h-2 rounded-lg">
          <div
            className="bg-green-500 h-2 rounded-lg"
            style={{
              width: `${(data.distance_from_source / data.total_distance) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-center text-xs text-gray-500">{data.ahead_distance_text}</p>
      </div>
      <div className="bg-gray-200 p-2 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Next Stop</h4>
        <p className="text-sm">{data.upcoming_stations[0].station_name}</p>
        <p className="text-xs text-gray-600">ETA: {data.upcoming_stations[0].eta}</p>
      </div>
    </div>
  );
};
export default TrainStatusCard;
