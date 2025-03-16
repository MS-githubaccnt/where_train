// import axios from "axios";
// const API_BASE_URL=import.meta.env.VITE_map_url;
// const API_KEY=import.meta.env.VITE_map_api_key;
// const getCoordinates=async(placeName:string[])=>{
//     const firstWords=placeName.map(str=>str.split(" ")[0]);
//     const maxItems=40;
//     let finalString;
//     if (firstWords.length > maxItems) {
//         const step=Math.floor(firstWords.length/maxItems);
//         finalString=firstWords.filter((_, index)=>index%step===0).slice(0, maxItems).join(";");
//     }
//     finalString=firstWords.join(";");
//     try{
//         const response=await axios.get(`${API_BASE_URL}${finalString}.json?key=${API_KEY}`);
//         return response.data;
//     }catch(error){
//         console.error("Error getting train data:",error);
//         throw error;
//     }

// }
// export default getCoordinates;