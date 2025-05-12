// "use client"
import { CheckCircleIcon } from "lucide-react"
import PayButton from "./PayButton";
import axios from "axios";
import { useEffect, useState } from "react";

type SubscriptionData = {
    id: string,
    price: number,
    duration: number,
    maxSitesAllowed: number,
    purchases: any
}

const Pricing = () => {
    const [data, setData] = useState<SubscriptionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async() => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:3001/api/v1/getSubscriptions');
                setData(response.data.result);
                console.log(response.data);
            } catch (error) {
                console.error("Failed to fetch subscriptions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    if (isLoading || data.length < 3) {
        return <div className="flex justify-center items-center py-20">
            <div className="animate-spin mr-2">
                <CheckCircleIcon size={24} />
            </div>
            <span>Loading pricing plans...</span>
        </div>;
    }

    // Create pricing plans only when data is available
    const pricingPlans = [
        {
            id : `${data[0]?.id}`,
            name: "Basic",
            price: `${(Number(data[0]?.price) / (10 ** 3)).toFixed(2)}`,
            period: "per month",
            description: "Perfect for personal websites and small projects",
            features: [
                `Monitor up to ${data[0]?.maxSitesAllowed} websites`,
                "Checks every 60 seconds",
                "10 geographic regions",
                "24 hour data retention",
                "Email notifications"
            ]
        },
        {
            id : `${data[1]?.id}`,
            name: "Pro",
            price: `${(Number(data[1]?.price) / (10 ** 3)).toFixed(2)}`,
            period: "per month",
            description: "Ideal for businesses with multiple websites",
            popular: true,
            features: [
                `Monitor up to ${data[1]?.maxSitesAllowed} websites`,
                "Checks every 30 seconds",
                "7 geographic regions",
                "7 day data retention",
                "Email & SMS notifications",
                "API access"
            ]
        },
        {
            id : `${data[2]?.id}`,
            name: "Enterprise",
            price: `${(Number(data[2]?.price) / (10 ** 3)).toFixed(2)}`,
            period: "per month",
            description: "For large organizations with critical websites",
            features: [
                `Monitor up to ${data[2]?.maxSitesAllowed} websites`,
                "Checks every 15 seconds",
                "12 geographic regions",
                "30 day data retention",
                "All notification channels",
                "Priority support",
                "Custom metrics"
            ]
        }
    ];

    return (
        <section id="pricing" className="py-20 relative">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute left-20 top-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 blur-3xl"></div>
            </div>
        
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1 text-xs font-semibold tracking-wider bg-teal-900/30 text-teal-400 rounded-full mb-4">PRICING</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Simple, Transparent Pricing</h2>
                    <p className="text-gray-400">Pay with ETH for only what you use, with no hidden fees or long-term commitments.</p>
                </div>
        
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <div key={index} className={`relative ${plan.popular ? 'transform scale-105 z-10' : ''}`}>
                            <div className={plan.popular ? 'absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl blur-sm' : ''}></div>
                            <div className={`h-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl backdrop-blur-sm backdrop-filter ${plan.popular ? 'relative' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold px-3 py-1 uppercase rounded-tr-2xl rounded-bl-2xl">
                                        Most Popular
                                    </div>
                                )}
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="mb-4">
                                        <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">{plan.price} EDU</span>
                                        <span className="text-gray-400 ml-2">{plan.period}</span>
                                    </div>
                                    <p className="text-gray-400 mb-6">{plan.description}</p>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="text-teal-500 mr-3 mt-1"><CheckCircleIcon size={18} /></div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-auto p-8 pt-0">
                                    <PayButton plan={plan}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;