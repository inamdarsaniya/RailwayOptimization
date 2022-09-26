const express=require("express")
const router=express.Router()

const{
    getTrains,
    getTrain,
    getDirectTrains
}=require("../controllers/trainController")




router.get("/",getDirectTrains)

router.get("/:id",getTrain)


module.exports=router