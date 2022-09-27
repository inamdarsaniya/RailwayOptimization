const mongoose=require("mongoose")
const Schema=mongoose.Schema

const trainSchema=new Schema({
    start_time:{
        type:String,
        required:true
    },
    end_time:{
        type:String,
        required:true
    },
    start_station:{
        type:String,
        required:true
    },
    end_station:{
        type:String,
        required:true
    },
    path:{
        type:Array,
        default:undefined
    },
    type:{
        type:String,
        default:"harbour"
    },
    way:{
        type:String,
        default:"up_the_line",
        required:true
    }
})

module.exports=mongoose.model("Train",trainSchema)

