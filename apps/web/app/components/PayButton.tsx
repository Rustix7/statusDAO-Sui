import { SubscriptionStoreId , ContractId } from "../utils/contractDetails"
import { useState, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import axios from "axios";

const PayButton = ({ plan , index}: { plan: any , index: number}) => {
    const [isLoading, setIsLoading] = useState(false)
    const { getToken } = useAuth();
    const suiClient = useSuiClient();
    const [isPurchased, setIsPurchased] = useState(false);

    const {mutateAsync : signAndExecuteTransaction , isSuccess , isPending} = useSignAndExecuteTransaction();

    const getFreshToken = useCallback(async () => {
        try {
            const freshToken = await getToken();
            return freshToken;
        } catch (error) {
            console.error("Error fetching fresh token:", error);
            return null;
        }
    }, [getToken]);

    const subscribeHandler = async (e: React.MouseEvent) => {
        e.preventDefault()
        setIsLoading(true);
        console.log("Subscribing to plan:", plan.name)

        try {
            const freshToken = await getFreshToken();

            if (!freshToken) {
                throw new Error("Failed to obtain authentication token");
            }

            let id = 0;
            const tx = new Transaction();
            const [payment] = tx.splitCoins(tx.gas,[tx.pure.u64(plan.price * (10**9))]);
            tx.moveCall({
                target : `${ContractId}::uptime::buy_subscription`,
                arguments : [
                    tx.object(SubscriptionStoreId),
                    tx.pure.u64(id),
                    payment
                ]
            })

            const res = await signAndExecuteTransaction({
                transaction : tx
            })

            console.log(res.digest);

            const result2 = await axios.post('http://localhost:3001/api/v1/purchaseSubscription',
                {
                    subscriptionId: String(index),
                    transactionHash: "random123"
                },
                {
                    headers: {
                        Authorization: `Bearer ${freshToken}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            console.log("Purchase result:", result2.data)
            setIsPurchased(true)
        } catch (error) {
            console.error("Error during subscription process:", error)
        } finally {
            setIsLoading(false);
        }
    }

    if(isPurchased && isSuccess) {
        return <div className={`w-full py-3 rounded-full transition text-center ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white' : 'bg-slate-800 text-white border border-slate-700'
        }`}>
        Successfully Purchased
    </div>
    }
    if(isLoading || isPending){
        return <div className={`w-full py-3 rounded-full transition text-center ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white' : 'bg-slate-800 text-white border border-slate-700'
        }`}>
        Loading...
    </div>
    }
    else {
        return (
            <button
                className={`w-full py-3 rounded-full transition ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                onClick={subscribeHandler}
            >
                Subscribe with SUI
            </button>
        )
    }
}

export default PayButton