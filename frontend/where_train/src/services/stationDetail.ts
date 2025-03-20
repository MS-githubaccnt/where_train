import axios from "axios";
const getStationDetails=async(code:string)=>{
    try{
        const response=await axios.get(`http://localhost:3000/station_details/${code}`)
        return response.data;
    }catch(error){
        console.error("Error getting train details:",error);
        throw error;
    }
}
export default getStationDetails;