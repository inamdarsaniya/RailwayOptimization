const { rawListeners } = require("../models/trainModel");
const Train=require("../models/trainModel")

//variables

const nodes=["panvel","belapur","nerul","vashi","kurla","wadala","csmt"]
const harbour_stations=["csmt","masjid","sandhurstroad","dockyardroad","reayroad","cottongreen","sewri","wadala","gtbnagar","chunabhatti","kurla","tilaknagar","chembur","govandi","mankhurd","vashi","sanpada","juinagar","nerul","seawoods","belapur","kharghar","mansarovar","khandeshwar","panvel"]
var input_arr="panvel"
var input_dest="csmt"
arr_index=harbour_stations.indexOf(input_arr)
dest_index=harbour_stations.indexOf(input_dest)
var down_the_line

arr_index=harbour_stations.indexOf(input_arr)
dest_index=harbour_stations.indexOf(input_dest)
if (arr_index>dest_index){
    down_the_line=true
    toward="down_the_line"
    
}else{
    down_the_line=false
    toward="up_the_line"
}



var inputTime={
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





//to get direct trains between source and dest
const getDirectTrains=async(req,res)=>{
    list=[]
    
    var directTrains=await Train.find({$and:[{way:toward},{"path.station":{$all:[input_arr,input_dest]}}]}).sort({start_time:1})
    const result=correct_direct_train(directTrains,input_arr,inputTime)
    const train=await Train.findById(result._id)
    trial=get_dest_time(train,input_dest)
    if(trial.hasOwnProperty("a")){
        result["c"]=trial.a;
        result["d"]=trial.b;
        result["src"]=input_arr;
        result["dest"]=input_dest
    }
    const train_info=await Train.findById(train._id)
    const send_frontend=sendFrontend(result,train_info)

    
    res.status(200).json(send_frontend)
}

function sendFrontend(result,train){
    
    list=[]
    lis=[]
    li={}
    key=0
    
    source_time=(result.a+" : "+result.b)
    dest_time=(result.c+" : "+result.d)
    s=result.a*60+result.b
    d=result.c*60+result.d
    t=d-s
    hr=Math.floor(t/60)
    mn=t%60
    
    list.push(result.src)
    list.push(source_time)
    list.push(result.dest)
    list.push(dest_time)
    list.push("Duration : "+hr+" hours "+mn+" mins ")

    for (ele of train.path){
        li["key"]=key
        key++
        li["station"]=ele.station
        z=ele.time
        for (v of z){
            h= v.a
            m= v.b
        }
        tme=h+" : "+m
        li["time"]=tme
        li["platform"]=ele.platform
        lis.push(li)
        li={}
    }
    list.push(lis)

    return list
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
    var station
    if (down_the_line){
        starting=harbour_stations.indexOf(input_arr)
        ending=harbour_stations.indexOf(input_dest)
        station=harbour_stations.slice(ending+1,starting).reverse()
    }else{
        starting=harbour_stations.indexOf(input_arr)
        ending=harbour_stations.indexOf(input_dest)
        station=harbour_stations.slice(starting+1,ending)
    }
    
    
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
        var directTrains=await Train.find({$and:[{way:toward},{"path.station":{$all:[input_arr,node]}}]}).sort({start_time:1})
        result=correct_direct_train(directTrains,input_arr,inputTime)
        train=await Train.findById(result._id)
        trial=get_dest_time(train,node)
        result["node"]=node
        result["c"]=trial.a;
        result["d"]=trial.b;
        
        listing.push(result)
        time_obj["a"]=String(trial.a)
        time_obj["b"]=String(trial.b)
        

        directTrains1=await Train.find({$and:[{way:toward},{"path.station":{$all:[node,input_dest]}},{_id:{$ne:result._id}}]}).sort({start_time:1})
        result1=correct_direct_train(directTrains1,node,time_obj)
        train=await Train.findById(result1._id)
        trial=get_dest_time(train,input_dest)
        result1["node"]=node
        result1["c"]=trial.a;
        result1["d"]=trial.b;
        listing.push(result1)
        
        
    }
    
    test=time_diff(listing)
    group=grouping(test)
    correct_node=correctNode(group)
    
    little=[]
    train_info=await Train.findById(correct_node[2]._id)
    train_info1=await Train.findById(correct_node[3]._id)
    little.push(train_info,train_info1)
    re=sendFrontendSwitching(correct_node,little)
    
    res.status(200).json(re)
    
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

//grouping of two similar nodes to form an array
function grouping(test){
    var temp=0
    var lis=[]
    unilist=[]
    for (ele of test){
        temp++
        lis.push(ele)
        if (temp%2==0){
            unilist.push(lis)
            lis=[]
        }

    }
    return unilist
}

//function to calculate time between switching...waiting time
function correctNode(groups){
    switching_train=[]
    wait=[]
    test=1000
    var total
    for (ele of groups){
        s1=(ele[0].c)*60+(ele[0].d)
        s2=(ele[1].a)*60+(ele[1].b)
        temp=s2-s1
        
        total=temp+ele[0].dtime+ele[1].dtime
        wait.push(total)
        wait.push(ele[0].node)
    }
    for(i=0;i<wait.length;i+=2){
        if(wait[i]<test){
            test=wait[i]
        }
    }
    ind=wait.indexOf(test)
    nod=wait[ind+1]
    switching_train.push(test,nod)
    for(ele of group){
        if(ele[0].node==nod){
            switching_train.push(ele[0],ele[1])
        }
    }
    return switching_train
}


const postDirectTrains=async(req,res)=>{
    const {source,dest,time}=req.body
    arr=time.split(":")
    inputTime.a=arr[0]
    inputTime.b=arr[1]
    input_arr=source
    input_dest=dest
    //to determine the way the train is going
    arr_index=harbour_stations.indexOf(input_arr)
    dest_index=harbour_stations.indexOf(input_dest)
    if (arr_index>dest_index){
        down_the_line=true
        toward="down_the_line"
        
    }else{
        down_the_line=false
        toward="up_the_line"
    }
    res.status(200).json(toward)
    
}


function sendFrontendSwitching(result,train){
    
    list=[]
    lis=[]
    li={}
    key=0
    
    source_time=(result[2].a+" : "+result[2].b)
    dest_time=(result[3].c+" : "+result[3].d)
    hr=Math.floor(result[0]/60)
    mn=result[0]%60
    
    list.push(input_arr)
    list.push(source_time)
    list.push(result[1])
    list.push(input_dest)
    list.push(dest_time)
    
    list.push("Duration : "+hr+" hours "+mn+" mins")
    

    for (ele of train[0].path){
        li["key"]=key
        key++
        li["station"]=ele.station
        z=ele.time
        for (v of z){
            h= v.a
            m= v.b
        }
        tme=h+" : "+m
        li["time"]=tme
        li["platform"]=ele.platform
        lis.push(li)
        li={}
    }
    list.push(lis)

    lis=[]
    for (ele of train[1].path){
        li["key"]=key
        key++
        li["station"]=ele.station
        z=ele.time
        for (v of z){
            h= v.a
            m= v.b
        }
        tme=h+" : "+m
        li["time"]=tme
        li["platform"]=ele.platform
        lis.push(li)
        li={}
    }
    list.push(lis)

    return list
}



module.exports={
    getTrain,
    getTrains,
    getDirectTrains,
    getSwitchingTrains, 
    postDirectTrains
}
