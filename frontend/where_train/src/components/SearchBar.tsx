import {useState} from "react";
import getTrainData from "../services/trainStatus.ts";
import getCoordinates from "../services/coordinates.ts";
import {SearchBarProps} from "../../types.ts";
const SearchBar=({onCoordData,onEtaData,onPrevData,onTrainInfo}:SearchBarProps)=>{
  //only if ayi hui array ki length 2 hai
  //get comments of stuff
    const [searchQuery,setSearchQuery]=useState("");
    const handleSearch=async()=>{
        if(!searchQuery.trim())return;
        try{
            const response=await getTrainData(searchQuery);
            console.log(response);
            const data=response;
            console.log(`sending data${data}`);
            onTrainInfo(response);
            let current_stn=data.current_station_name;
            const stationNames=data.upcoming_stations.map((station:any)=>station.station_name);
            const gone_coords=data.previous_stations.map((station:any)=>[station.station_lat,station.station_lng]);
            onPrevData(gone_coords);
            stationNames.unshift(current_stn);
            const etas=data.upcoming_stations.map((station:any)=>station.eta);
            onEtaData(etas);
            console.log(response);
            const final_coords=data.upcoming_stations.map((station:any)=>[station.station_lat,station.station_lng]);
           // const geo_response=await getCoordinates(stationNames);
            //const final_coords=geo_response.map((place:any)=>{place.features[0].center});
            console.log(final_coords);
            onCoordData(final_coords);
           // console.log(geo_response);
        }catch(error){
            console.error(error);
        }
        setSearchQuery("");
    }
    return (<div className="z-100 w-full max-w-sm min-w-[200px]">
    <div className="relative">
      <input
        className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        placeholder="Search Train Numbers...." 
        value={searchQuery}
        onChange={(e)=>setSearchQuery(e.target.value)}
      />
      <button
        className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        onClick={handleSearch}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
          <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
        </svg>
        Search
      </button> 
    </div>
  </div>);
}
export default SearchBar;