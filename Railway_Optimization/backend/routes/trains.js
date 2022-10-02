const express=require("express")
const router=express.Router()

const{
    getTrains,
    getTrain,
    getDirectTrains,
    getSwitchingTrains,
    postDirectTrains
}=require("../controllers/trainController")

router.get("/switchingtrain",getSwitchingTrains)
router.get("/train",getDirectTrains)
router.post("/",postDirectTrains)

router.get("/:id",getTrain)


module.exports=router
