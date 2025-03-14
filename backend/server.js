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
           //console.log(train.previous_stations);
            train.previous_stations.map((station)=>{
                all_stas.push(convertToSeconds(station.sta));
                all_lat_lngs.push([station.station_lat,station.station_lng]);
              })
              //current station
              all_lat_lngs.push([train.current_lat,train.current_lng]);
              all_stas.push(train.cur_stn_sta);
              //upcoming station
              train.upcoming_stations.map((station)=>{
                //all_stations.push(station.station_name);
                all_stas.push(convertToSeconds(station.sta));
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
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
