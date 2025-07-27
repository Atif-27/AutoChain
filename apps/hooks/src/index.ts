import express from 'express'

const app=express();

app.post("/webhook/:userId/:zapId",(req,res)=>{
    const userId=req.params.userId;
    const zapId=req.params.zapId;


    // store in db a new trigger

    // push it into kafka/redis
})