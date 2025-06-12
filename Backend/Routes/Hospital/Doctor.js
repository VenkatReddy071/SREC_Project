const {fetchDoctor,updateDoctorPartial }=require("../../Controllers/Hospitals/Doctors");

const express=require("express");
const router=express.Router();

router.get("/:id",fetchDoctor);
router.put("/doctor/:id",updateDoctorPartial);

module.exports=router;