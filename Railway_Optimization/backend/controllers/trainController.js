const Train=require("../models/trainModel")

//variables

const nodes=["panvel","kharghar","belapur","nerul","vashi","kurla","wadala","csmt"]
const harbour_stations=["csmt","masjid","sandhurst","dockyard","reay","cotton","sewri","wadala","GTB","chunabhatti","kurla","tilak","chembur","govandi","mankhurd","vashi","sanpada","juinagar","nerul","seawoods","belapur","kharghar","mansarovar","khandeshwar","panvel"]
const input_arr="panvel";
const input_dest="juinagar";
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
    b:35
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
    
    const result=direct_Train(directTrains)
    if(result=="No direct trains available"){
        res.status(200).json({mssg:"No direct trains available"})
    }else{
        res.status(200).json(result)
    }
    
}

//function to get the direct train
function direct_Train(directTrains){
    if(directTrains.length==0){
        return "No direct trains available"
        
    }else{
        var list=time_at_station(directTrains,input_arr)
        comparison=compare_time(list[0],inputTime)
        if (comparison==true){
            return list
        }else{
            there=remove_train(directTrains,list[1]._id)
            temp=direct_Train(there)
            return temp
        }
    }
}


function remove_train(trains,identifier){
    var ind
    for (train of trains){
        if(train._id==identifier){
            ind=trains.indexOf(train)
            trains.splice(ind,1)
            return trains
            
        }
    }
    

}



//



//get time at a particular station
function time_at_station(trains,station){
    list=[]
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
function compare_time(time1,time2){
    if(time1.a>time2.a){
        return true
    }else if(time1.a==time2.a&&time1.b>=time2.b){
        return true
    }
    else{
        return false
    }
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
    var directTrains
    var nodes_in_path
    var list1=[]
    var list2=[]
    var list3=[]
    var list4=[]
    var t2
    if (down_the_line=true){
        nodes_in_path=nodes_down_the_line()
        for (nod of nodes_in_path){
            directTrains=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[input_arr,nod]}}]}).sort({start_time:1})
            list1=time_at_station(directTrains,input_arr)
            list2=time_at_station(directTrains,nod)
            directTrains1=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[nod,input_dest]}},{_id:{$ne:list1[1]._id}}]}).sort({start_time:1})
            list3=time_at_station(directTrains1,nod)
            list4=time_at_station(directTrains1,nod)
           
            test1=compare_time(list1[0],inputTime)
            test2=compare_time(list1[0],inputTime)

            
        }
    }
    
    //var switchingTrains=await Train.find({$and:[{way:"down_the_line"},{"path.station":{$all:[input_arr,input_dest]}}]})
    res.status(200).json(list2)
    
    
}



module.exports={
    getTrain,
    getTrains,
    getDirectTrains,
    getSwitchingTrains
}
