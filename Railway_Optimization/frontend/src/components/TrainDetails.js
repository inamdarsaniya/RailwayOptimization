const TrainDetails=({pat})=>{
 return(
    <div className="train-details">
        <h4>Station: {pat.station}</h4>
        <p><strong>Time: {pat.time}</strong></p>
        <p><strong>Platform: {pat.platform}</strong></p>
    </div>
 )
}
export default TrainDetails