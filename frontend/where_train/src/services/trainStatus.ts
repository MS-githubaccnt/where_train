import axios from "axios";

const API_BASE_URL=import.meta.env.VITE_train_url;
const getTrainData=async(trainName:string)=>{
    try{
        const response=await axios.get("http://localhost:3000")
        // const response=await axios.get(`${API_BASE_URL}?trainNo=${trainName}&startDay=1`,{
        //     headers:{
        //         "X-RapidAPI-Host":import.meta.env.VITE_X_RapidAPI_Host,
        //         "X-RapidAPI-Key":import.meta.env.VITE_X_RapidAPI_Key,
        //         "x-apihub-key":import.meta.env.VITE_x_apihub_key,
        //         "x-apihub-host":import.meta.env.VITE_x_apihub_host,
        //         "x-apihub-endpoint":import.meta.env.VITE_x_apihub_endpoint
        //     }
        // });
        return response.data;

    }catch(error){
        console.error("Error getting train data:",error);
        throw error;
    }

}
export default getTrainData;