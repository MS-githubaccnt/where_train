import { Circle, MapContainer, Polyline, TileLayer } from "react-leaflet";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import TrainStatusCard from "../components/TrainStatusCard";

export default function MapPage() {
  const [etaData,setEtaData]=useState<string[]>([]);
  const [coordData,setCoordData]=useState<number[][]>([]);
  const [currCoords,setCurrCoords]=useState<number[]>([]);
  const [passedStations,setPassedStations]=useState(0);
  const [prevCoordData,setPrevCoordData]=useState<number[][]>([]);
  const [trainInfo,setTrainInfo]=useState<any>(null);
  const [timeOfRequest,setTimeOfRequest]=useState<number>(0);

  const handleCoordData=(data:number[][])=>setCoordData(data);
  const handleEtaData=(data:string[])=>setEtaData(data);
  const handlePrevCoordData=(data:number[][])=>setPrevCoordData(data);
  const handleTrainInfo=(data:any)=>{
    setTrainInfo(data);
    setTimeOfRequest(convertToSeconds(data.update_time.split(" ")[1].slice(0, 5)));
  };

  const convertToSeconds=(timeStr:string):number=>{
    const [hours,minutes]=timeStr.split(":").map(Number);
    return hours*3600+minutes*60;
  };

  useEffect(() => {
    if (coordData.length===0||etaData.length===0) return;
    let stationIndex=passedStations;
    let interval:NodeJS.Timeout;
    const moveTrain=()=>{
      if (stationIndex>=etaData.length-1) return;
      const etaSeconds=convertToSeconds(etaData[stationIndex]);
      const nextEtaSeconds=convertToSeconds(etaData[stationIndex+1]);
      if (timeOfRequest>=nextEtaSeconds){
        stationIndex++;
        setPassedStations(stationIndex);
      } else {
        const elapsed=timeOfRequest-etaSeconds;
        const totalTravelTime=nextEtaSeconds-etaSeconds;
        const startCoord=coordData[stationIndex];
        const endCoord=coordData[stationIndex + 1];
        if (!startCoord||!endCoord) return;
        const progress=Math.min(elapsed/totalTravelTime,1);
        setCurrCoords([
          startCoord[0]+progress*(endCoord[0]-startCoord[0]),
          startCoord[1]+progress*(endCoord[1]-startCoord[1])
        ]);
        setTimeOfRequest(timeOfRequest+1);
      }
    };
    interval=setInterval(moveTrain, 1000);
    return()=>clearInterval(interval);
  },[timeOfRequest,coordData,etaData,passedStations]);
  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[5000]">
        <SearchBar onCoordData={handleCoordData} onEtaData={handleEtaData} onPrevData={handlePrevCoordData} onTrainInfo={handleTrainInfo} />
      </div>
      <MapContainer center={[28.7, 77.1]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {coordData.length > 0 && <Polyline positions={coordData} color="blue" />}
        {prevCoordData.length > 0 && <Polyline positions={prevCoordData} color="blue" dashArray="10,5" />}
        {currCoords.length > 0 && <Circle center={currCoords} radius={2800} />}
      </MapContainer>
      <div className="absolute top-10 left-10 z-[5001]">
        {trainInfo && <TrainStatusCard data={trainInfo} />}
      </div>
    </div>
  );
}
