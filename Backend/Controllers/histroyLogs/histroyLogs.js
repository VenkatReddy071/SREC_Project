const HistoryLogs=require("../../models/HistoryLogs/historyLogs");
const getHistory=async(req,res)=>{
    try{
        const history=await HistoryLogs.find({}).sort({timestamp:-1});
        return res.status(200).json(history);
    }
    catch(error){
        return res.status(400).json(error);
    }

}

module.exports={getHistory};