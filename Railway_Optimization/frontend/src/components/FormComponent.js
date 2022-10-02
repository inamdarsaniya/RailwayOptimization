import { useState } from "react"
import {Link} from "react-router-dom"

const FormComponent=()=>{
    const[source,setSource]=useState("")
    const[dest,setDest]=useState("")
    const[time,setTime]=useState("")
    const[error,setError]=useState(null)
    const [emptyFeilds,setEmptyFeilds]=useState([])

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const tr={source,dest,time}
        console.log(JSON.stringify(tr))

        const response=await fetch("/api/trains/",{
            method:"POST",
            body:JSON.stringify(tr),
            headers:{
                "Content-Type":"application/json"
            }
        }
        )
        const json=await response.json()
        console.log(response)
        if (!response.ok){
            setError(json.error)
            setEmptyFeilds(json.emptyFeilds)
        }
        if (response.ok){
            setSource("")
            setDest("")
            setTime("")
            setError(null)
            setEmptyFeilds([])
        }
        
    }

    return(
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new goal</h3>

            <label>Source:</label>
            <input
            type="text"
            onChange={(e)=>setSource(e.target.value)}
            value={source}
            className={emptyFeilds.includes("source")?"error":""}
            />

            <label>Destination:</label>
            <input
            type="text"
            onChange={(e)=>setDest(e.target.value)}
            value={dest}
            className={emptyFeilds.includes("dest")?"error":""}

            />

            <label>Time :</label>
            <input
            type="text"
            onChange={(e)=>setTime(e.target.value)}
            value={time}
            className={emptyFeilds.includes("time")?"error":""}

            />

            <Link to="/train/"><button>Add Goal</button></Link>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default FormComponent