import axios from "axios";
const getTrainData=async()=>{
    try{
        const response=await axios.get("https://where-train.onrender.com/live_api")
        //alert(response.data);
        console.log("answer is....");
        console.log(response.data);
        return response.data;
    }catch(error){
        console.error("Error getting train data:",error);
        throw error;
    }
}
export default getTrainData;