import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingMessage, SignupIncomingMessage } from "common/types";
import { prisma } from "db/schema";
import { sendEmail } from "./email";
import {ethers} from "ethers";

const availableValidators: { validatorId: string, socket: ServerWebSocket<unknown>, publicKey: string }[] = [];

const CALLBACKS : { [callbackId: string]: (data: IncomingMessage) => void } = {}
const COST_PER_VALIDATION = 1000;

Bun.serve({
    fetch(req, server) {
      if (server.upgrade(req)) {
        return;
      }
      return new Response("Upgrade failed", { status: 500 });
    },
    port: 8080,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            const data: IncomingMessage = JSON.parse(message);
            console.log("data is : " , data);
            if (data.type === 'signup') {
                console.log("signup buddy")
                const verified = await verifyMessage(
                    `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
                    data.data.publicKey,
                    data.data.signedMessage
                );
                if (verified) {
                    await signupHandler(ws, data.data);
                }
            } else if (data.type === 'validate') {
                CALLBACKS[data.data.callbackId]?.(data);
                delete CALLBACKS[data.data.callbackId];
            }
        },
        async close(ws: ServerWebSocket<unknown>) {
            availableValidators.splice(availableValidators.findIndex(v => v.socket === ws), 1);
        }
    },
});

async function signupHandler(ws: ServerWebSocket<unknown>, { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage) {
    const validatorDb = await prisma.node.findFirst({
        where: {
            pubKey : publicKey,
        },
    });

    console.log(validatorDb);

    if (validatorDb) {
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb.id,
                callbackId,
            },
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws,
            publicKey: validatorDb.pubKey,
        });
        return;
    }

    console.log("hi there creating in the db");
    
    //TODO: Given the ip, return the location
    const validator = await prisma.node.create({
        data: {
            ip,
            pubKey : publicKey,
            location: 'unknown',
        },
    });

    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: validator.id,
            callbackId,
        },
    }));

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.pubKey,
    });
}

async function verifyMessage(message: string, publicKey: string, signature: string) {

    const derivedAddress = ethers.verifyMessage(message,signature);
    return derivedAddress.toLowerCase() === publicKey.toLowerCase();
}

setInterval(async () => {
    const websitesToMonitor = await prisma.website.findMany({
        where: {
            disabled: false,
        },
    });

    console.log(websitesToMonitor);

    console.log(availableValidators);

    for (const website of websitesToMonitor) {
        availableValidators.forEach(validator => {
            const callbackId = randomUUIDv7();
            console.log(`Sending validate to ${validator.validatorId} ${website.url}`);
            validator.socket.send(JSON.stringify({
                type: 'validate',
                data: {
                    url: website.url,
                    callbackId
                },
            }));

            CALLBACKS[callbackId] = async (data: IncomingMessage) => {
                if (data.type === 'validate') {
                    const { validatorId, status, latency, signedMessage } = data.data;
                    const verified = await verifyMessage(
                        `Replying to ${callbackId}`,
                        validator.publicKey,
                        signedMessage
                    );
                    if (!verified) {
                        return;
                    }

                    await prisma.$transaction(async (tx) => {
                        await tx.websiteStatus.create({
                            data: {
                                websiteId: website.id,
                                nodeId : validatorId,
                                status,
                                latency,
                            },
                        });

                        await tx.node.update({
                            where: { id: validatorId },
                            data: {
                                pendingPayouts: { increment: COST_PER_VALIDATION },
                            },
                        });
                    });

                    if(status === "Bad" && website.notifyByEmail){
                        sendEmail({
                            from: "hello@demomailtrap.co",
                            to: website.notifyEmail,
                            subject: `Your site ${website.url} is down`,
                            text: 'Please take a look your site is down currently'
                          }
                        );
                    }
                }
            };
        });
    }
}, 2 * 60 * 1000);