import axios from "axios";
const getTrainData=async()=>{
    try{
        const response=await axios.get("http://localhost:3000/live_api")
        return response.data;
    }catch(error){
        console.error("Error getting train data:",error);
        throw error;
    }
}
export default getTrainData;