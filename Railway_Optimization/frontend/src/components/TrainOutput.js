import TrainDetails from "./TrainDetails"
import { useState,useEffect } from "react"

const TrainOutput=()=>{
    const [src,setSource]=useState(null)
    const [source_time,setSourceTime]=useState(null)
    const [dest,setDest]=useState(null)
    const [dest_time,setDestTime]=useState(null)
    const [duration,setDuration]=useState(null)
    const [path,setPath]=useState(null)
    var tr
    
    
   
    useEffect(()=>{

        
        const fetchDirectTrains=async()=>{
            const response=await fetch("/api/trains/train")
            tr=await response.json()
            console.log(tr)
            if(response.ok){
                setSource(tr[0])
                setSourceTime(tr[1])
                setDest(tr[2])
                setDestTime(tr[3])
                setDuration(tr[4])
                setPath(tr[5])

            }
        }
        fetchDirectTrains()

    },[]);





    return(
        <div className="trains">
        <div className="ini">
            <p><strong>Source:&nbsp;&nbsp;&nbsp;{src}</strong></p>
            <p><strong>Time at Source: &nbsp;&nbsp;&nbsp;{source_time}</strong></p>
            <p><strong>Destination: &nbsp;&nbsp;&nbsp;{dest}</strong></p>
            <p><strong>Time at Destination: &nbsp;&nbsp;&nbsp;{dest_time}</strong></p>
            <p><strong>{duration}</strong></p>

        </div>
        
        {path && path.map((pat)=>(
            <TrainDetails key={pat.key} pat={pat}/>
            
        ))}
    </div>
    )
   }
   export default TrainOutput