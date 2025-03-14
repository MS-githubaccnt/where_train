import { useEffect, useState } from "react";
import getTrainData from "../services/trainStatus";
const convertToSeconds=(timeStr:string):number=>{
    const [hours,minutes]=timeStr.split(":").map(Number);
    return hours*3600+minutes*60;
};
const useTrainData=()=>{
    //coord stat stationnames traininfo
    const [trainInfo,setTrainInfo]=useState(null);
    const [staData,setStaData]=useState<number[]>([]);
    const [coordData,setCoordsData]=useState<number[][]>([]);
    const [stationNames,setStationNames]=useState<string[]>([]);
    useEffect(()=>{
    const fetchData=async()=>{
    try{
      const all_stations:string[]=[];
      const all_stas=[];
      const all_lat_lngs: number[][]=[];
      const response=await getTrainData();
      console.log(response);
      const data=response;
      console.log(`sending data${data}`);
     // onTrainInfo(response);
      let current_stn=data.current_station_name;
      //previous stations
        data.previous_stations.map((station:any)=>{
          all_stations.push(station.station_name);
          all_stas.push(convertToSeconds(station.sta));
          all_lat_lngs.push([station.station_lat,station.station_lng]);
        })
        //current station
        all_stations.push(current_stn);
        all_stas.push(data.cur_stn_sta);
        //upcoming station
        data.upcoming_stations.map((station:any)=>{
          all_stations.push(station.station_name);
          all_stas.push(convertToSeconds(station.sta));
          all_lat_lngs.push([station.station_lat,station.station_lng]);
        })
       // onStationNames(all_stations);
        //onStaData(all_stas);
        console.log(response);
        //onCoordData(all_lat_lngs);
        setTrainInfo(response);
        setCoordsData(all_lat_lngs);
        setStaData(all_stas);
        setStationNames(all_stations);

    }catch(error){
        console.error(error);
    }
}
fetchData();
},[]);
return {trainInfo,staData,stationNames,coordData};
}

export default useTrainData;