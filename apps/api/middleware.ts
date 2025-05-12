//@ts-ignore
import { NextFunction , Request , Response } from "express";
import { verifyToken } from "@clerk/clerk-sdk-node";
import "dotenv";

export async function authMiddleware(req : Request,res : Response,next : NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "Unauthorized: Missing token" });
            return;
        }

        const token = authHeader.split(" ")[1]; 

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });

        if (!payload.sub) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }

        req.userId = payload.sub; 
        next(); 
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}