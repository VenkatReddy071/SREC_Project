const {fetchDoctor}=require("../../Controllers/Hospitals/Doctors");

const express=require("express");
const router=express.Router();

router.get("/:id",fetchDoctor);

module.exports=router;