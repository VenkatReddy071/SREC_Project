const {getHistory}=require("../Controllers/histroyLogs/histroyLogs");

const express=require("express");
const router=express.Router();

router.get("/history",getHistory);

module.exports=router;