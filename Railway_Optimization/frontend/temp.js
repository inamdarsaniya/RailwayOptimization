import { useEffect,useState } from "react"


const Home=()=>{

    const [train,setTrain]=useState(null)
    var tr
    
   
    useEffect(()=>{
        
        const fetchDirectTrains=async()=>{
            const response=await fetch("/api/trains/")
            tr=await response.json()
            console.log(tr)
            if(response.ok){
                setTrain(tr)
            }
        }
        fetchDirectTrains()

    },[]);

    

    return (
        <div className="home">
            <div className="trains">

            {train[1]}


            </div>
        </div>
    )
}
export default Home




function sendFrontend(result,train){
    
    list=[]
    lis=[]
    li=[]
    
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
        li.push(ele.station)
        z=ele.time
        for (v of z){
            h= v.a
            m= v.b
        }
        tme=h+" : "+m
        li.push(tme)
        li.push(ele.platform)
        lis.push(li)
        li=[]
    }
    list.push(lis)

    return list
}


const response=await fetch("/api/trains",req={
    method:"GET",
    body:JSON.stringify(info),
    headers:{
        "Content-Type":"application/json"
    }
})