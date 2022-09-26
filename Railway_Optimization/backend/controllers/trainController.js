const Train=require("../models/trainModel")

//variables
var finalDirectTrain;

const input_arr="juinagar";
const input_dest="vashi";
const inputTime={
    a:4,
    b:5
}




//get all trains

const getTrains=async(req,res)=>{
    const trains=await Train.find({}).sort({start_time:1})
    res.status(200).json(trains)
}


//get a single train
const getTrain=async(req,res)=>{
    const{id}=req.params

    const train=await Train.findById(id)

    if(!train){
        return res.status(404).json({error:"No such train"})
    }

    res.status(200).json(train)
}

const getDirectTrains=async(req,res)=>{
    var tr_time;
    var directTrains=await Train.find({"path.station":{$all:[input_arr,input_dest]}})
    for (train of directTrains){
        for(ele of train.path){
            if(ele.station==input_arr){
                tr_time=ele
            }
        }
     }
    res.status(200).json(tr_time)
}


module.exports={
    getTrain,
    getTrains,
    getDirectTrains
}