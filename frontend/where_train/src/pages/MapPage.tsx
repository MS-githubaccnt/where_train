import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import SearchBar from "../components/SearchBar";
import { useState, useEffect, useMemo } from "react";
import TrainStatusCard from "../components/TrainStatusCard";
import getTrainData from "../services/trainStatus";
import getTrainDetails from "../services/trainDetails";
import StationCard from "../components/StationCard";
import L from "leaflet";
import {DateTime} from "luxon";
import convertToSeconds from "../utils/convert2seconds";

export default  function MapPage() {

const [stations,setStations]=useState([]);
const [trainHoverIndex,SetTrainHoverIndex]=useState(null);
const [userLocation,setUserLocation]=useState(null)
const [trainData,setTrainData]=useState<any[]>([]);
const [stationInfo,setStationInfo]=useState<any[]|null>(null);
const [currentCoords,setCurrentCoords]=useState<number[][]>([]);
const [isSelected,setIsSelected]=useState(false);
const [selectedData,setSelectedData]=useState(null);
  async function clickHandler(index:number){
  setIsSelected(true);
  const response=await getTrainDetails(index);
  setSelectedData(response);
}
const customIcon=new L.Icon({
  iconUrl:'https://raw.githubusercontent.com/MS-githubaccnt/images/refs/heads/main/pngtree-train-icon-png-image_1043136-removebg-preview.png',
  iconSize:[15,15],
  iconAnchor:[7.5,7.5]
})
const customHoverIcon=new L.Icon({
  iconUrl:'https://raw.githubusercontent.com/MS-githubaccnt/images/refs/heads/main/pngtree-train-icon-png-image_1043136-removebg-preview%20(1).png',
  iconSize:[15,15],
  iconAnchor:[7.5,7.5]
})
useEffect(()=>{
//   fetch('/stations.geojson').then(response=>response.json())
//   .then(data=>setStations(data.features||[]))
//
 },[]
)
useEffect(()=>{
navigator.geolocation.getCurrentPosition(
  (position)=>{
    setUserLocation({latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
  },
  (error)=>{
    setUserLocation(null);
  }
);},[currentCoords]);

function resetSelection(){
  setIsSelected(false);
  setSelectedData(null);
}
function handleStationInfo(data:any){
  setStationInfo(data);

}
function resetStation(){
  setStationInfo(null);
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
    let currTime=convertToSeconds(DateTime.now().setZone("Asia/Kolkata").toFormat("HH:mm:ss"));
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
  const stationMarkers = useMemo(() => (
    stations.map((station, index) => (
      <Marker key={index} position={[station.properties.lat, station.properties.long]}>
        <Popup>{station.properties.name}</Popup>
      </Marker>
    ))
  ), [stations]);
  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[5000]">
        { <SearchBar onStationInfo={handleStationInfo}/> }
      </div>
      <MapContainer center={[28.7, 77.1]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stationMarkers
        }
        {currentCoords.length>0&&
          currentCoords.map((coord,index)=>(
            <Marker key={index} position={coord} icon={(index==trainHoverIndex)?customHoverIcon:customIcon} 
            eventHandlers={
              {
                mouseover:()=>SetTrainHoverIndex(index),
                mouseout:()=>SetTrainHoverIndex(null),
              click:async ()=>{
                await clickHandler(index);
              }}
            }></Marker>
          ))}
          {userLocation&&<Circle center={[userLocation.latitude,userLocation.longitude]} radius={500} color='yellow'>
            <Tooltip>Your location</Tooltip>
            </Circle>}
          {stationInfo&&<div className="absolute top-20 left-5 z-[5001]" >
            <button onClick={resetStation} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">X</button>
            <StationCard trains={stationInfo}/></div>}
         { selectedData&&isSelected&&<Polyline positions={selectedData.station_lat_lng} color="blue" opacity={0.4}></Polyline>}
         {selectedData&&isSelected&&<div className="absolute top-10 left-10 z-[5001]" >
          <button onClick={resetSelection} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">✖</button>
          <TrainStatusCard data={selectedData}></TrainStatusCard>
          </div>}

      </MapContainer>
    </div>
  );
}


