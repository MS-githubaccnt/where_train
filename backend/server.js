import express from 'express';
import fs from 'fs';
import cors from "cors";
import { DateTime } from 'luxon';
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const FILE_PATH = 'data.json'; // Path to your JSON file
const convertToSeconds=(timeStr)=>{
    const [hours,minutes]=timeStr.split(":").map(Number);
    return hours*3600+minutes*60;
};
function upperBound(arr, target) {
    let left = 0, right = arr.length;
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] > target) right = mid;  // Move left if arr[mid] is greater
        else left = mid + 1;  // Move right otherwise
    }
    return left;
}
app.get('/', (req, res) => {
    try {
        // Read JSON from file
        const jsonData = fs.readFileSync(FILE_PATH, 'utf-8');
        const parsedData=JSON.parse(jsonData);
        res.json(JSON.parse(jsonData));
    } catch (error) {
        res.status(500).json({ error: 'Error reading JSON file' });
    }
});
app.get ('/live_api',(req,res)=>{
    try{
        const jsonData=fs.readFileSync(FILE_PATH,'utf-8');
        const parsedData=JSON.parse(jsonData);
       // const  now=new Date();
        const currTime=convertToSeconds(DateTime.now().setZone("Asia/Kolkata").toFormat("HH:mm:ss"));
        console.log(currTime);
        const arr=parsedData.trains;
        let result=[];
        for (let train of arr){
           let  all_stas=[];
           let all_lat_lngs=[];
           //console.log(result);
           let last_sta;
           let next_sta;
           let last_lat_lng;
           let next_lat_lng;
           let days=0;
           let prev=0;
           //console.log(train.previous_stations);
            train.previous_stations.map((station)=>{
                if(station.station_name!=""){
                if(all_stas.length!=0){
                    if(prev>convertToSeconds(station.sta))days++;
                }
                all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
                all_lat_lngs.push([station.station_lat,station.station_lng]);
            prev=convertToSeconds(station.sta);}
              })
              //current station
              if(all_stas.length!=0){
                if(prev>convertToSeconds(train.cur_stn_sta))days++;
            }
              all_lat_lngs.push([train.current_lat,train.current_lng]);
              all_stas.push(convertToSeconds(train.cur_stn_sta)+days*24*60*60);
              prev=convertToSeconds(train.cur_stn_sta)
              //upcoming station
              train.upcoming_stations.map((station)=>{
                if(station.station_name!=""){
                if(all_stas.length!=0){
                    if(prev>convertToSeconds(station.sta))days++;
                }
                //all_stations.push(station.station_name);
                all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
                all_lat_lngs.push([station.station_lat,station.station_lng]);
            prev=convertToSeconds(station.sta)}
              })
              let index=upperBound(all_stas,currTime);
              if(index==all_stas.length){
                last_sta=currTime;
                next_sta=currTime;
                next_lat_lng=all_lat_lngs[all_lat_lngs.length-1];
                last_lat_lng=all_lat_lngs[all_lat_lngs.length-1];
              }else{
                next_sta=all_stas[index];
                next_lat_lng=all_lat_lngs[index];
                //console.log(index);
                if(index!=0){
                last_sta=all_stas[index-1];
                last_lat_lng=all_lat_lngs[index-1];}
                else{
                    last_sta=all_stas[0];
                    last_lat_lng=all_lat_lngs[0];
                }
              }
              result.push(
                {
                    'next_sta':next_sta,
                    'last_sta':last_sta,
                    'last_lat_lng':last_lat_lng,
                    'next_lat_lng':next_lat_lng
                }
              );
             
        }
        res.json(result);
    }catch(e){
        res.status(500).json({error:`Error getting live data ${e}`})
    }
})
app.get('/train_details/:index',(req,res)=>{
    try{
        const currTime=convertToSeconds(DateTime.now().setZone("Asia/Kolkata").toFormat("HH:mm:ss"));
        const jsonData=fs.readFileSync(FILE_PATH,'utf-8');
        const parsedData=JSON.parse(jsonData);
        const index=parseInt(req.params.index);
        const arr=parsedData.trains;
        const train=arr[index];
        const all_lat_lngs=[];
        const all_stas=[];
        const all_stations=[]
        let days=0;
        let prev=0;
        let last_sta;
           let next_sta;
        train.previous_stations.map((station)=>{
            if(station.station_name!=""){
            
            if(all_stas.length!=0){
                if(prev>convertToSeconds(station.sta))days++;
            }
            all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
            all_lat_lngs.push([station.station_lat,station.station_lng]);
            all_stations.push(station.station_name);
        prev=convertToSeconds(station.sta)}

          })
          //current station
          if(all_stas.length!=0){
            if(prev>convertToSeconds(train.cur_stn_sta))days++;
        }
        prev=convertToSeconds(train.cur_stn_sta);
          all_lat_lngs.push([train.current_lat,train.current_lng]);
          all_stas.push(convertToSeconds(train.cur_stn_sta)+days*24*60*60);
          all_stations.push(train.current_station_name);
          //upcoming station
          train.upcoming_stations.map((station)=>{
            if(station.station_name!=""){
            if(all_stas.length!=0){
                if(prev>convertToSeconds(station.sta))days++;
            }
            all_stations.push(station.station_name);
            all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
            all_lat_lngs.push([station.station_lat,station.station_lng]);
        prev=station.sta;}
          })
          let current_station_index=upperBound(all_stas,currTime);
              if(current_station_index==all_stas.length){
                last_sta=currTime;
                next_sta=currTime;
                next_lat_lng=all_lat_lngs[all_lat_lngs.length-1];
                last_lat_lng=all_lat_lngs[all_lat_lngs.length-1];
              }else{
                next_sta=all_stas[current_station_index];
                next_lat_lng=all_lat_lngs[current_station_index];
                //console.log(index);
                if(current_station_index!=0){
                last_sta=all_stas[current_station_index-1];
                last_lat_lng=all_lat_lngs[current_station_index-1];}
                else{
                    last_sta=all_stas[0];
                    last_lat_lng=all_lat_lngs[0];
                }
              }
        let result={
            "name":train.train_name,
            "number":train.train_number,
            "source":train.source_stn_name,
            "destination":train.dest_stn_name,
            "station_names":all_stations,
            "station_lat_lng":all_lat_lngs,
            "station_stas":all_stas,
            "last_sta":last_sta,
            "next_sta":next_sta,
             "upcoming_station_index":current_station_index
        }
        res.json(result);


    }catch(e){
        res.status(500).json({error:`Error sending train details ${e}`})
    }
})
app.get('/station_details/:code',(req,res)=>{
    try {
        const code=req.params.code;
        const jsonData=fs.readFileSync(FILE_PATH,'utf-8');
        const parsedData=JSON.parse(jsonData);
        const kmdata=fs.readFileSync('kmvalues.json','utf-8');
        const parsedKmData=JSON.parse(kmdata);
        const arr=parsedData.trains;
        let results=[];
        
        for(let train of arr){
            let prev=0;
        
            let last_sta;
        const all_stations=[];
        const all_stas=[];
        const stations_recorded=[];
            let days=0;
            train.previous_stations.map((station)=>{
                
                if(station.station_name!=""){
                    if(all_stas.length!=0){
                        if(prev>convertToSeconds(station.sta)){
                            days++
                        };
                    }
                all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
                all_stations.push(station.station_code);
            prev=convertToSeconds(station.sta)
        }
                if(station.station_code in parsedKmData){
                    stations_recorded.push(station.station_code);
                    last_sta=convertToSeconds(station.sta)+days*24*60*60;
                }
              })
              //current station
              
              if(all_stas.length!=0){
                if(prev>convertToSeconds(train.cur_stn_sta))days++;
            }
              all_stas.push(convertToSeconds(train.cur_stn_sta)+days*24*60*60);
              prev=convertToSeconds(train.cur_stn_sta);
              if(train.current_station_code in parsedKmData){
                stations_recorded.push(train.current_station_code);
                last_sta=convertToSeconds(train.cur_stn_sta)+days*24*60*60;
            }
              all_stations.push(train.current_station_code);
              //upcoming station
              train.upcoming_stations.map((station)=>{
                
                if(station.station_name!=""){
                if(all_stas.length!=0){
                    if(prev>convertToSeconds(station.sta))days++;
                }
                all_stations.push(station.station_code);
                all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
                if(station.station_code in parsedKmData){
                    stations_recorded.push(station.station_code);
                    last_sta=convertToSeconds(station.sta)+days*24*60*60;
                }
                prev=station.sta;

            }
              });
              if(stations_recorded.length!=0){
                const last=stations_recorded[stations_recorded.length-1];
                const last_km=parsedKmData[last];
                let req_km=parsedKmData[code];
                console.log(req_km);
                let diff=req_km-last_km;
                let time_diff=diff*60;
                console.log(days);
                let sta_of_req=last_sta+time_diff;
                results.push({
                    "name":train.train_name,
                    "number":train.train_number,
                    "sta":sta_of_req
                });
              }




        }
        res.json(results);
    }catch(e){
        res.status(500).json({error:`Error sending station details ${e}`})
    }
})
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
