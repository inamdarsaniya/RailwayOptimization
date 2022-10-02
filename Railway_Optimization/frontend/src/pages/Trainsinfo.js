import { useEffect,useState } from "react"

//components

import TrainForm from "../components/TrainForm"
import TrainOutput from "../components/TrainOutput"

const Trainsinfo=()=>{

    
    return (
        <div className="home">
            <TrainOutput src={src} source_time={source_time} dest={dest} dest_time={dest_time} duration={duration} path={path}/>
            <TrainForm/>
        </div>
    )
}
export default Home 
