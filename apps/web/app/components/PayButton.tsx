import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { contractABI, contractAddress } from "../utils/contractDetails"
import { parseEther } from "viem"
import axios from "axios"
import { useEffect, useState, useCallback } from "react"
import { getEthersProvider } from "./etherProvider"
import { config } from "./walletProvider"
import { ethers } from "ethers"
import { useEthersSigner } from "./etherSigner"
import { useAuth } from "@clerk/nextjs"

const PayButton = ({ plan }: { plan: any }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isPurchased, setIsPurchased] = useState(false)
    // const provider = getEthersProvider(config);
    const { getToken } = useAuth();
    const signer = useEthersSigner()

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
            const contract = new ethers.Contract(contractAddress, contractABI, signer)!;
            const result = await contract.subscribe!(parseEther(String(plan.price)), { value: parseEther(String(plan.price)) });
            console.log(result.hash);
            const hash = result.hash;

            const result2 = await axios.post('http://localhost:3001/api/v1/purchaseSubscription',
                {
                    subscriptionId: plan.id,
                    transactionHash: hash
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

    if (isLoading) {
        return (
            <div className={`w-full py-3 rounded-full transition text-center ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white' : 'bg-slate-800 text-white border border-slate-700'
                }`}>
                Loading...
            </div>
        )
    }

    if (isPurchased) {
        return (
            <div className={`w-full py-3 rounded-full transition text-center ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white' : 'bg-slate-800 text-white border border-slate-700'
                }`}>
                Successfully purchased
            </div>
        )
    }

    return (
        <button
            className={`w-full py-3 rounded-full transition ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
            onClick={subscribeHandler}
        >
            Subscribe with ETH
        </button>
    )
}

export default PayButton