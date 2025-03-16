import express from 'express';
import fs from 'fs';
import cors from "cors";
const app = express();
app.use(cors());
const PORT = 3000;
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
        const  now=new Date();
        const currTime=now.getHours()*3600+now.getMinutes()*60;
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
           //console.log(train.previous_stations);
            train.previous_stations.map((station)=>{
                if(all_stas.length!=0){
                    if(all_stas[all_stas.length-1]>convertToSeconds(station.sta))days++;
                }
                all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
                all_lat_lngs.push([station.station_lat,station.station_lng]);
              })
              //current station
              if(all_stas.length!=0){
                if(all_stas[all_stas.length-1]>convertToSeconds(train.cur_stn_sta))days++;
            }
              all_lat_lngs.push([train.current_lat,train.current_lng]);
              all_stas.push(convertToSeconds(train.cur_stn_sta)+days*24*60*60);
              //upcoming station
              train.upcoming_stations.map((station)=>{
                if(all_stas.length!=0){
                    if(all_stas[all_stas.length-1]>convertToSeconds(station.sta))days++;
                }
                //all_stations.push(station.station_name);
                all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
                all_lat_lngs.push([station.station_lat,station.station_lng]);
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
        const  now=new Date();
        const currTime=now.getHours()*3600+now.getMinutes()*60;
        const jsonData=fs.readFileSync(FILE_PATH,'utf-8');
        const parsedData=JSON.parse(jsonData);
        const index=parseInt(req.params.index);
        const arr=parsedData.trains;
        const train=arr[index];
        const all_lat_lngs=[];
        const all_stas=[];
        const all_stations=[]
        let days=0;
        let last_sta;
           let next_sta;
           let last_lat_lng;
           let next_lat_lng;
        train.previous_stations.map((station)=>{
            if(all_stas.length!=0){
                if(all_stas[all_stas.length-1]>convertToSeconds(station.sta))days++;
            }
            all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
            all_lat_lngs.push([station.station_lat,station.station_lng]);
            all_stations.push(station.station_name);
          })
          //current station
          if(all_stas.length!=0){
            if(all_stas[all_stas.length-1]>convertToSeconds(train.cur_stn_sta))days++;
        }
          all_lat_lngs.push([train.current_lat,train.current_lng]);
          all_stas.push(convertToSeconds(train.cur_stn_sta)+days*24*60*60);
          all_stations.push(train.current_station_name);
          //upcoming station
          train.upcoming_stations.map((station)=>{
            if(all_stas.length!=0){
                if(all_stas[all_stas.length-1]>convertToSeconds(station.sta))days++;
            }
            all_stations.push(station.station_name);
            all_stas.push(convertToSeconds(station.sta)+days*24*60*60);
            all_lat_lngs.push([station.station_lat,station.station_lng]);
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
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
