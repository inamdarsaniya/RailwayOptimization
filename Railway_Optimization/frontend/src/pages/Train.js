import { useEffect,useState } from "react"

//components


import TrainOutput from "../components/TrainOutput"

const Train=()=>{

    const [src,setSrc]=useState(null)
    const [source_time,setSourceTime]=useState(null)
    const [dest,setDest]=useState(null)
    const [dest_time,setDestTime]=useState(null)
    const [duration,setDuration]=useState(null)
    const [path,setPath]=useState(null)

    var tr
    
        useEffect(()=>{
            const fetchDirectTrains=async()=>{
                const response=await fetch("/api/trains/")
                tr=await response.json()
                setSrc(tr[0])
                setSourceTime(tr[1])
                setDest(tr[2])
                setDestTime(tr[3])
                setDuration(tr[4])
                setPath(tr[5])


                console.log(tr[5])
                
            }
            fetchDirectTrains()
            
        },[])
    
    return (
        <div className="home">
            <TrainOutput src={src} source_time={source_time} dest={dest} dest_time={dest_time} duration={duration} path={path}/>
        </div>
    )
}
export default Train 
