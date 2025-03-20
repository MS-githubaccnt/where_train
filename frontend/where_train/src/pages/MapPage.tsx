import { Circle, MapContainer, Polyline, TileLayer } from "react-leaflet";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import TrainStatusCard from "../components/TrainStatusCard";
import getTrainData from "../services/trainStatus";
import getTrainDetails from "../services/trainDetails";
import StationCard from "../components/StationCard";
export default  function MapPage() {
const [trainData,setTrainData]=useState<any[]>([]);
const [stationInfo,setStationInfo]=useState<any[]>([]);
const [currentCoords,setCurrentCoords]=useState<number[][]>([]);
const [isSelected,setIsSelected]=useState(false);
const [selectedData,setSelectedData]=useState(null);
  async function clickHandler(index:number){
  setIsSelected(true);
  const response=await getTrainDetails(index);
  setSelectedData(response);
}
function resetSelection(){
  setIsSelected(false);
  setSelectedData(null);
}
function handleStationInfo(data:any){
  setStationInfo(data);

}
useEffect(()=>{
  async function fetchTrainData(){
    const response=await getTrainData();
    setTrainData(response);
  }
  fetchTrainData();
  const apiInterval=setInterval(fetchTrainData,5000);
  return()=>clearInterval(apiInterval);
},[]);
  useEffect(()=>{
     function updatePosition(){
    const  now=new Date();
    const currTime=now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
    let current_coords:number[][]=[]
    for(let i=0;i<trainData.length;i++){
      let train=trainData[i];
      console.log(train);
      let coord=[0,0]
      if(train.next_sta==train.last_sta){coord=train.next_lat_lng;}
     else{ coord=[train.last_lat_lng[0]+(train.next_lat_lng[0]-train.last_lat_lng[0])*(train.next_sta-currTime)/(train.next_sta-train.last_sta),train.last_lat_lng[1]+(train.next_lat_lng[1]-train.last_lat_lng[1])*(train.next_sta-currTime)/(train.next_sta-train.last_sta)]}
     console.log(coord);
     current_coords.push(coord);
    }
    setCurrentCoords(current_coords);}
    updatePosition();
    let interval=setInterval(updatePosition,500);
    return()=>clearInterval(interval);
  },[trainData]);

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[5000]">
        { <SearchBar onStationInfo={handleStationInfo}/> }
      </div>
      <MapContainer center={[28.7, 77.1]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentCoords.length>0&&
          currentCoords.map((coord,index)=>(
            <Circle key={index} center={coord} radius={500} color='blue'
            eventHandlers={
              {
              click:async ()=>{
                await clickHandler(index);
              }}
            }></Circle>
          ))}
          {stationInfo&&<div className="absolute top-10 left-10 z-[5001]" ><StationCard trains={stationInfo}/></div>}
         { selectedData&&isSelected&&<Polyline positions={selectedData.station_lat_lng} color="blue" opacity={0.4}></Polyline>}
         {selectedData&&isSelected&&<div className="absolute top-10 left-10 z-[5001]" >
          <button onClick={resetSelection} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">✖</button>
          <TrainStatusCard data={selectedData}></TrainStatusCard>
          </div>}

      </MapContainer>
    </div>
  );
}

