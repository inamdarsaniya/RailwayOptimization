const { rawListeners } = require("../models/trainModel");
const Train=require("../models/trainModel")

//variables

const nodes=["panvel","belapur","nerul","vashi","kurla","wadala","csmt"]
const harbour_stations=["csmt","masjid","sandhurstroad","dockyardroad","reayroad","cottongreen","sewri","wadala","gtbnagar","chunabhatti","kurla","tilaknagar","chembur","govandi","mankhurd","vashi","sanpada","juinagar","nerul","seawoods","belapur","kharghar","mansarovar","khandeshwar","panvel"]
const input_arr="panvel";
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
    a:10,
    b:30
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

//parsing through to find the accurate direct train



//to get direct trains between source and dest
const getDirectTrains=async(req,res)=>{
    if (down_the_line==true){
        var directTrains=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[input_arr,input_dest]}}]}).sort({start_time:1})
    }else{
        var directTrains=await Train.find({$and:[{way:"up_the_line"},{"path.station":{$all:[input_arr,input_dest]}}]}).sort({start_time:1})
    }
    
    const result=time_at_station(directTrains,input_arr)
    
    const train=await Train.findById(result._id)
    res.status(200).json(train)
  
}



//comparing the list to find the most suitable train
function compare_list(list,time){
    var train
    var list1={
        a:24,
        b:60,
        _id:""
    }

    for (train of list){
        if((train.a<list1.a)&&(train.a>=time.a)){
            list1.a=train.a;
            list1.b=train.b;
            list1._id=train._id

        }else if((train.a=list1.a)&&(train.a>=time.a)){
            if(((train.b<list1.b)&&(train.b>=time.b))){
                list1.a=train.a;
                list1.b=train.b;
                list1._id=train._id
            }
        }
    }
 
    return list1
}





//get time at a particular station from group of stations
function time_at_station(trains,station){
    var temp
    list=[]
    for (train of trains){
        for(ele of train.path){
            if(ele.station==station){
                for (timing of ele.time){
                    temp=timing
                    temp["_id"]=train._id
                    list.push(temp)
                }                
            }
        }
    }
    var train_time=compare_list(list,inputTime)
    return train_time
}


//for determining the nodes between source and destination
function nodes_down_the_line(){
    var nodes_in_path=[]
    starting=harbour_stations.indexOf(input_arr)
    ending=harbour_stations.indexOf(input_dest)
    station=harbour_stations.slice(ending+1,starting).reverse()
    
    for(ele of nodes){
        if(station.includes(ele)){
            nodes_in_path.push(ele)
        }
    }
    return nodes_in_path
}

//time at station
function get_Time (list,station){
    
    for (ele of list[1].path){
        if(ele.station==station){
            for (timing of ele.time){
                return timing
                
            }
            
        }
    }
}


//for finding indirect trains between source and destination
const getSwitchingTrains=async(req,res)=>{
    var nodes_in_path=nodes_down_the_line()
    var results=[]
    var result1
    var result2
    var directTrains
    var time
    for(node of nodes_in_path){
        
        directTrains=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[input_arr,node]}}]}).sort({start_time:1})
        result1=direct_Train(directTrains)
        if(result1=="No direct trains available"){
            res.status(200).json({mssg:"No switching trains available"})
        }else{
            time=get_Time(result1,node);
            results.push(node)
            results.push(result1)
        }
        

        directTrains1=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[node,input_dest]}}]}).sort({start_time:1})
        result2=direct_Train(directTrains1,time,node);
        if(result2=="No direct trains available"){
            res.status(200).json({mssg:"No direct trains available"})
        }else{
            results.push(node)
            results.push(result2)
        }
        
    }




    res.status(200).json(results)
}


//removing unnecessary



module.exports={
    getTrain,
    getTrains,
    getDirectTrains,
    getSwitchingTrains
}
