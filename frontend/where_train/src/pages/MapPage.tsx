import { Circle, MapContainer, Polyline, TileLayer } from "react-leaflet";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import TrainStatusCard from "../components/TrainStatusCard";
import useTrainData from "../hooks/useTrainData";
function upperBound(arr, target) {
  let left = 0, right = arr.length;
  while (left < right) {
      let mid = Math.floor((left + right) / 2);
      if (arr[mid] > target) right = mid;  // Move left if arr[mid] is greater
      else left = mid + 1;  // Move right otherwise
  }
  return left;
}
export default function MapPage() {
  const [staData,setStaData]=useState<number[]>([]);
  const [coordData,setCoordData]=useState<number[][]>([]);
  const [currCoords,setCurrCoords]=useState<number[]>([]);
  const [passedStations,setPassedStations]=useState(0);
  const [stationNames,setStationNames]=useState<string[]>([]);
  const [trainInfo,setTrainInfo]=useState<any>(null);
  const [currentTime,setCurrentTime]=useState<number>(0);

  const handleCoordData=(data:number[][])=>{}//(data);
 const handleStaData=(data:string[])=>{//setStaData(data);
}
  const handleStationNames=(data:string[])=>{//setStationNames(data)

  };
  const handleTrainInfo=(data:any)=>{
    //setTrainInfo(data);
  };
  useEffect(()=>{
    const response=useTrainData();
    setTrainInfo(response.trainInfo);
    setStaData(response.staData);
    setStationNames(response.stationNames);
    setCoordData(response.coordData);
    const  now=new Date();
    const currTime=now.getHours()*3600+now.getMinutes()*60;
    setCurrentTime(currTime);
  },[]);

  useEffect(()=>{
    if (coordData.length===0||staData.length===0) return;
    
    let stationIndex=passedStations;
    let interval:NodeJS.Timeout;
    const moveTrain=()=>{
      if(stationIndex>=etaData.length-1) return;
      const etaSeconds=convertToSeconds(etaData[stationIndex]);
      const nextEtaSeconds=convertToSeconds(etaData[stationIndex+1]);
      if(timeOfRequest>=nextEtaSeconds){
        stationIndex++;
        setPassedStations(stationIndex);
      }else{
        const elapsed=timeOfRequest-etaSeconds;
        const totalTravelTime=nextEtaSeconds-etaSeconds;
        const startCoord=coordData[stationIndex];
        const endCoord=coordData[stationIndex+1];
        if (!startCoord||!endCoord) return;
        const progress=Math.min(elapsed/totalTravelTime,1);
        setCurrCoords([
          startCoord[0]+progress*(endCoord[0]-startCoord[0]),
          startCoord[1]+progress*(endCoord[1]-startCoord[1])
        ]);
        setTimeOfRequest(timeOfRequest+1);
      }
    };
    interval=setInterval(moveTrain,1000);
    return()=>clearInterval(interval);
  },[timeOfRequest,coordData,etaData,passedStations]);
  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[5000]">
        <SearchBar onCoordData={handleCoordData} onStaData={handleStaData} onStationNames={handleStationNames} onTrainInfo={handleTrainInfo}/>
      </div>
      <MapContainer center={[28.7, 77.1]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {coordData.length>0&&<Polyline positions={coordData} color="blue"/>}
        {prevCoordData.length>0&&<Polyline positions={prevCoordData} color="blue" dashArray="10,5"/>}
        {currCoords.length>0&&<Circle center={currCoords} radius={2800}/>}
      </MapContainer>
      <div className="absolute top-10 left-10 z-[5001]">
        {trainInfo&&<TrainStatusCard data={trainInfo}/>}
      </div>
    </div>
  );
}
function startUpFunction() {
  throw new Error("Function not implemented.");
}

