import { Circle, MapContainer, Polyline, TileLayer } from "react-leaflet";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import TrainStatusCard from "../components/TrainStatusCard";
import getTrainData from "../services/trainStatus";
export default  function MapPage() {

const [currentCoords,setCurrentCoords]=useState<number[][]>([]); 
  const handleCoordData=(data:number[][])=>{}//(data);
 const handleStaData=(data:string[])=>{//setStaData(data);
}
  const handleStationNames=(data:string[])=>{//setStationNames(data)

  };
  const handleTrainInfo=(data:any)=>{
    //setTrainInfo(data);
  };
  useEffect(()=>{
    async function doit(){
      const response=await getTrainData();
      console.log(response)
      function make_move(response:any[]){
    console.log("call");
    const  now=new Date();
    const currTime=now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
    let current_coords:number[][]=[]
    for(let i=0;i<response.length;i++){
      let train=response[i];
      console.log(train);
      let coord=[0,0]
      if(train.next_sta==train.last_sta){coord=train.next_lat_lng;}
     else{ coord=[train.last_lat_lng[0]+(train.next_lat_lng[0]-train.last_lat_lng[0])*(train.next_sta-currTime)/(train.next_sta-train.last_sta),train.last_lat_lng[1]+(train.next_lat_lng[1]-train.last_lat_lng[1])*(train.next_sta-currTime)/(train.next_sta-train.last_sta)]}
     console.log(coord);
     current_coords.push(coord);
    }
    setCurrentCoords(current_coords);}
    function make_it_move(){
      make_move(response);
    }
    let interval=setInterval(make_it_move,500);
    return()=>clearInterval(interval);
  }
  doit();
  
  },[]);

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[5000]">
        <SearchBar onCoordData={handleCoordData} onStaData={handleStaData} onStationNames={handleStationNames} onTrainInfo={handleTrainInfo}/>
      </div>
      <MapContainer center={[28.7, 77.1]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentCoords.length>0&&
          currentCoords.map((coord,index)=>(
            <Circle key={index} center={coord} radius={500} color='blue'></Circle>
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

