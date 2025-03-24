import axios from "axios";
const getTrainDetails=async(index:number)=>{
    try{
        const response=await axios.get(`https://where-train.onrender.com/train_details/${index}`)
        return response.data;
    }catch(error){
        console.error("Error getting train details:",error);
        throw error;
    }
}
export default getTrainDetails;