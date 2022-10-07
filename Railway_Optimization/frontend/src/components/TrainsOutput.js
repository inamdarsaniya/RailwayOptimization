import TrainsDetails from "./TrainsDetail"
import { useState,useEffect } from "react"

const TrainsOutput=()=>{
    const [src,setSource]=useState(null)
    const [source_time,setSourceTime]=useState(null)
    const [node,setNode]=useState(null)
    const [dest,setDest]=useState(null)
    const [dest_time,setDestTime]=useState(null)
    const [duration,setDuration]=useState(null)
    const [path1,setPath1]=useState(null)
    const [path2,setPath2]=useState(null)
    const [temp,setTemp]=useState(null)
    var tr
    
    
   
    useEffect(()=>{

        
        const fetchDirectTrains=async()=>{
            const response=await fetch("/api/trains/switchingtrain")
            tr=await response.json()
            console.log(tr)
            if (typeof tr=="object"){
                if(response.ok){
                    setSource(tr[0])
                    setSourceTime(tr[1])
                    setNode(tr[2])
                    setDest(tr[3])
                    setDestTime(tr[4])
                    setDuration(tr[5])
                    setPath1(tr[6])
                    setPath2(tr[7])
                    setTemp(tr)
    
                }
            }
            if (typeof tr=="string"){
                setTemp(tr)
            }
        }
        fetchDirectTrains()

    },[]);




    if(typeof temp=="object"){
        return(
            <div className="trains">
            <div className="ini">
                <p><strong>Source :&nbsp;&nbsp;&nbsp;{src}</strong></p>
                <p><strong>Time at Source : &nbsp;&nbsp;&nbsp;{source_time}</strong></p>
                <p><strong>Switch at : &nbsp;&nbsp;&nbsp;{node}</strong></p>
                <p><strong>Destination : &nbsp;&nbsp;&nbsp;{dest}</strong></p>
                <p><strong>Time at Destination : &nbsp;&nbsp;&nbsp;{dest_time}</strong></p>
                <p><strong>{duration}</strong></p>
    
            </div>
            <strong>First Train : </strong>
            
            {path1 && path1.map((pat)=>(
                <TrainsDetails key={pat.key} pat={pat} />
            ))}
            <strong>Second Train : </strong>
            
            {path2 && path2.map((pat)=>(
                <TrainsDetails key={pat.key} pat={pat} />
            ))}
        </div>
        )
    }
    if (typeof temp=="string"){
        return(
            <h2>No switching trains available</h2>
        )
    }
    
   }
   export default TrainsOutput
