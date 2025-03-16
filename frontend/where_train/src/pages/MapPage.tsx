import { Circle, MapContainer, Polyline, TileLayer } from "react-leaflet";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import TrainStatusCard from "../components/TrainStatusCard";
import getTrainData from "../services/trainStatus";
export default  function MapPage() {
const [trainData,setTrainData]=useState<any[]>([]);
const [currentCoords,setCurrentCoords]=useState<number[][]>([]); 
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
        {/* <SearchBar onCoordData={handleCoordData} onStaData={handleStaData} onStationNames={handleStationNames} onTrainInfo={handleTrainInfo}/> */}
      </div>
      <MapContainer center={[28.7, 77.1]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentCoords.length>0&&
          currentCoords.map((coord,index)=>(
            <Circle key={index} center={coord} radius={500} color='blue'
            eventHandlers={
              {
              click:()=>alert('Clickity')}
            }></Circle>
          ))
        /* {coordData.length>0&&<Polyline positions={coordData} color="blue"/>}
        {prevCoordData.length>0&&<Polyline positions={prevCoordData} color="blue" dashArray="10,5"/>}
        {currCoords.length>0&&<Circle center={currCoords} radius={2800}/>} */}
      </MapContainer>
      {/* <div className="absolute top-10 left-10 z-[5001]">
        {trainInfo&&<TrainStatusCard data={trainInfo}/>}
      </div> */}
    </div>
  );
}

