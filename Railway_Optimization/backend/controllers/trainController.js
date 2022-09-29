const { rawListeners } = require("../models/trainModel");
const Train=require("../models/trainModel")

//variables

const nodes=["panvel","belapur","nerul","vashi","kurla","wadala","csmt"]
const harbour_stations=["csmt","masjid","sandhurstroad","dockyardroad","reayroad","cottongreen","sewri","wadala","gtbnagar","chunabhatti","kurla","tilaknagar","chembur","govandi","mankhurd","vashi","sanpada","juinagar","nerul","seawoods","belapur","kharghar","mansarovar","khandeshwar","panvel"]
const input_arr="panvel";
const input_dest="masjid";
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
    list=[]
    if (down_the_line==true){
        var directTrains=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[input_arr,input_dest]}}]}).sort({start_time:1})
    }else{
        var directTrains=await Train.find({$and:[{way:"up_the_line"},{"path.station":{$all:[input_arr,input_dest]}}]}).sort({start_time:1})
    }
    
    const result=correct_direct_train(directTrains,input_arr,inputTime)
    const train=await Train.findById(result._id)
    trial=get_dest_time(train,input_dest)
    if(trial.hasOwnProperty("a")){
        result["c"]=trial.a;
        result["d"]=trial.b;
    }
    
    res.status(200).json(result)
}




//comparing the list to find the most suitable train
function compare_list(list,time){
    var train
    var list1={
        a:24,
        b:60,
        _id:""
    }
    first=parseInt(time.a)
    second=parseInt(time.b)

    for (train of list){
        if((train.a<list1.a)&&(train.a>time.a)){
            list1.a=train.a;
            list1.b=train.b;
            list1._id=train._id
    
        }else if((train.a==list1.a)&&(train.a>time.a)){
            if(train.b<list1.b){
                list1.a=train.a;
                list1.b=train.b;
                list1._id=train._id
            }
        }else if((train.a<list1.a)&&(train.a==time.a)){
            if(train.b>time.b){
                list1.a=train.a;
                list1.b=train.b;
                list1._id=train._id
            }
        }else if((train.a==list1.a)&&(train.a==time.a)){
            if((train.b<list1.b)&&(train.b>time.b)){
                list1.a=train.a;
                list1.b=train.b;
                list1._id=train._id
            }
        }
    }
 
    return list1
}

//time at dest based on a single train object
function get_dest_time(train,dest){ 
var timing
    for(ele of train.path){
        if (ele.station==dest){
            for(timing of ele.time){
                return timing
            }
        }
    }
}





//get time at a particular station from group of stations
function correct_direct_train(trains,station,time){
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
    var train_time=compare_list(list,time)
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




//for finding indirect trains between source and destination
const getSwitchingTrains=async(req,res)=>{
    nodes_in_path=nodes_down_the_line()
    var time_obj={}
    
    var listing=[]
    for(node of nodes_in_path){
        var directTrains=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[input_arr,node]}}]}).sort({start_time:1})
        result=correct_direct_train(directTrains,input_arr,inputTime)
        train=await Train.findById(result._id)
        trial=get_dest_time(train,node)
        result["node"]=node
        result["c"]=trial.a;
        result["d"]=trial.b;
        listing.push(result)
        time_obj["a"]=String(trial.a)
        time_obj["b"]=String(trial.b)
        

        directTrains1=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[node,input_dest]}},{_id:{$ne:result._id}}]}).sort({start_time:1})
        result1=correct_direct_train(directTrains1,node,time_obj)
        train=await Train.findById(result1._id)
        trial=get_dest_time(train,input_dest)
        result1["node"]=node
        result1["c"]=trial.a;
        result1["d"]=trial.b;
        listing.push(result1)
    }
    
    test=time_diff(listing)
    
    res.status(200).json(test)
    
}

//function to calculate time between source and dest
function time_diff (listing){
    track=[] 
    listy={}
    
    for (lis of listing){
        source=lis.a*60+lis.b
        dest=lis.c*60+lis.d
        time=dest-source
        listy={}
        listy["_id"]=lis._id
        listy["node"]=lis.node
        listy["dtime"]=time
        listy["a"]=lis.a
        listy["b"]=lis.b
        listy["c"]=lis.c
        listy["d"]=lis.d
        
        
        track.push(listy) 
    }
    return track
    
}







module.exports={
    getTrain,
    getTrains,
    getDirectTrains,
    getSwitchingTrains
}
