const Train=require("../models/trainModel")

//variables
var finalDirectTrain;

const harbour_stations=["CST","masjid","sandhurst","dockyard","reay","cotton","sewri","wadala","GTB","chunabhatti","kurla","tilak","chembur","govandi","mankhurd","vashi","sanpada","juinagar","nerul","seawoods","CBD","kharghar","mansarovar","khandeshwar","panvel"]
const input_arr="juinagar";
const input_dest="vashi";
const arr_index=harbour_stations.indexOf(input_arr)
const dest_index=harbour_stations.indexOf(input_dest)
var down_the_line

//to determine the way the train is going
if (arr_index>dest_index){
    down_the_line=true
}else{
    down_the_line=false
}

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

//to get direct trains between source and dest
const getDirectTrains=async(req,res)=>{
    if (down_the_line==true){
        var directTrains=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[input_arr,input_dest]}}]})
    }else{
        var directTrains=await Train.find({$and:[{way:"up_the_line"},{"path.station":{$all:[input_arr,input_dest]}}]})
    }
    
    if(directTrains.length==0){
        res.status(200).json({mssg:"No direct trains available"})
        
    }else{
        const list=time_at_station(directTrains,input_arr)
        comparison=compare_time(list[0])
        res.status(200).json(list)
    }

    
}


//



//get time at a particular station
function time_at_station(trains,station){
    list=[]
    var tr_time;
    var trial_train
    for (train of trains){
        for(ele of train.path){
            if(ele.station==station){
                for (timing of ele.time){
                    list[0]=timing
                    list[1]=train
                    return list
                }
            }
        }
    }
}

//for comparing timing with the inputed value
function compare_time(time){
    if(time.a>inputTime.a){
        return true
    }else if(time.a==inputTime.a&&time.b>=inputTime.b){
        return true
    }
    else{
        return false
    }
}


module.exports={
    getTrain,
    getTrains,
    getDirectTrains
}
