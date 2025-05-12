//@ts-ignore
import {OutgoingMessage, SignupOutgoingMessage,ValidateOutgoingMessage} from "common/types"
import { randomUUIDv7 } from "bun";
import 'dotenv';
import {ethers} from "ethers";
import { Wallet } from "ethers";

require('dotenv').config();
let validatorId : string | null = null;
const Callbacks : {[callbackId : string] : (data : SignupOutgoingMessage) => void} = {};

const main = async() => {

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);

    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = async(event) => {
        const data : OutgoingMessage = JSON.parse(event.data.toString());

        if(data.type === 'signup'){
            Callbacks[data.data.callbackId]?.(data.data);
            delete Callbacks[data.data.callbackId];
        }
        else if(data.type === 'validate'){
            await validateHandler(data.data,wallet,ws);
        }
    }

    ws.onopen = async() => {
        const callbackId = randomUUIDv7();
        Callbacks[callbackId] = (data : SignupOutgoingMessage) => {
            validatorId = data.validatorId;
        }
        const signedMessage = await wallet.signMessage(`Signed message for ${callbackId}, ${wallet.address}`);

        if(signedMessage) {
            ws.send(JSON.stringify({
                type : 'signup',
                data : {
                    callbackId : callbackId,
                    publicKey : wallet.address,
                    ip : '127.0.0.1',
                    signedMessage : signedMessage
                }
            }))
        }
        else return;
    }
}

const validateHandler = async(data : ValidateOutgoingMessage , wallet : Wallet , ws : WebSocket) => {
    console.log(`Validating ${data.url}`);
    const startTime = Date.now();
    const signature = await wallet.signMessage(`Replying to ${data.callbackId}`);

    try {
        const response = await fetch(data.url);
        const endTime = Date.now();
        const latency = endTime - startTime;
        const status = response.status;

        console.log(data.url);
        console.log(status);

        //@ts-ignore
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId : data.callbackId,
                status: status === 200 ? 'Good' : 'Bad',
                latency,
                websiteId : data.websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    } catch (error) {

        //@ts-ignore
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId : data.callbackId,
                status:'Bad',
                latency: 1000,
                websiteId : data.websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
        console.error(error);
    }
}

main();

setInterval(() => {
    
}, 10000);