import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";
import {prisma} from "db/schema";


const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/v1/website-status',authMiddleware,async(req,res) => {

    // const websiteId = req.query.websiteId!;
    const userId = req.userId;
    try{
        const result = await prisma.website.findMany({
            where : {
                userId
            },
            include : {
                status : true
            }
        })

        res.json(result);

    }
    catch(e){
        console.log(e);
        res.status(404).json({
            msg : "No website found"
        })
    }
})

app.post('/api/v1/website-notifications',authMiddleware,async(req,res) => {

    console.log("I was called");
    const {websiteId,notifyEmail,notifyPhone} = req.body;

    console.log(websiteId , notifyEmail , notifyPhone)

    let data;
    if(notifyEmail.length > 0){
        data = {
            notifyByEmail : true,
            notifyEmail : notifyEmail
        }
    }
    else{
        data = {
            notifyByPhone : true,
            notifyPhone : notifyPhone
        }
    }

    try{
        const result = await prisma.website.update({
            where : {id : websiteId},
            data : data
        })
        
        console.log(result);
        res.status(200).json({result});
    }
    catch(e) {
        res.status(500).json({
            msg : "Internal error"
        })
    }
})

app.post('/api/v1/website-remove-notifications',authMiddleware,async(req,res) => {

    const {websiteId , type} = req.body;
    let data;
    if(type === 'removeEmail'){
        data = {
            notifyByEmail : false,
        }
    }
    else {
        data = {
            notifyByPhone : false
        }
    }

    try{
        const result = await prisma.website.update({
            where : {id : websiteId},
            data : data
        })
        
        console.log(result);
        res.status(200).json({result})
    }catch(e){
        res.status(501).json({
            msg : "Internal error"
        })
    }
})

app.get('/api/v1/userPurchases',authMiddleware, async(req,res) => {

    const userId = req.userId;

    try{
        const result = await prisma.purchases.findMany({
            where : {
                userId
            },
            include : {
                subscription : true
            }
        })

        res.status(200).json({
            result
        })
        return
    }
    catch(e){
        res.status(501).json({
            msg : "Internal Error",
        })
    }


})

app.get('/api/v1/getSubscriptions',async(req,res) => {
    
    try{
        const result = await prisma.subscriptions.findMany({});

        res.status(200).json({
            result
        })
    }
    catch(e){
        res.status(501).json({
            msg : "Internal Error"
        })
    }
})

app.get('/api/v1/websites',authMiddleware,async(req,res) => {

    const userId = req.userId!;
    try {
        const result = await prisma.website.findMany({
            where : {
                userId
            }
        })

        res.json(result);

    } catch (error) {
        console.log(error);
    }
})

app.post('/api/v1/create-website',authMiddleware,async(req,res) => {
    try {
        const userId = req.userId!;
        const {url} = req.body;

        const result = await prisma.website.create({
            data : {
                url,
                userId
            }
        })
        console.log(result);
        res.status(200).json({id : result.id});

    } catch (error) {
        console.log(error)
        res.status(501).json({
            msg : "unable to add currently try later"
        })
    }
})

app.delete('/api/v1/delete-website',authMiddleware,async(req,res) => {
    try {

        const userId = req.userId;
        const websiteId = req.query.websiteId;

        await prisma.websiteStatus.deleteMany({
            where: {websiteId :  websiteId as string },  // First, delete related status records
        });

        const result = await prisma.website.delete({
            where : {
                userId,
                id : websiteId as string
            },
        })
        console.log(result);
        res.status(200).json({result});
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            msg : "unable to delete it currently"
        })
    }
})

app.post('/api/v1/purchaseSubscription',authMiddleware,async(req,res) => {

    const userId = req.userId!;
    const {subscriptionId , transactionHash} = req.body

    try{

        const result = await prisma.purchases.create({
            data : {
                userId,
                subscriptionId,
                transactionHash
            }
        })
        res.status(200).json({result});
    }

    catch(e){
        res.status(501).json({
            msg : "Internal Error"
        })
    }
})

app.listen(3001,() => {
    console.log("listening on port 3001");
})
