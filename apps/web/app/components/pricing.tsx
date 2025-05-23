// "use client"
import { CheckCircleIcon } from "lucide-react"
import PayButton from "./PayButton";
import { SubscriptionStoreId } from "../utils/contractDetails";
import { useSuiClientQuery } from "@mysten/dapp-kit";

type SubscriptionData = {
    price: number,
    validity: number,
    maxSitesAllowed: number,
}

const Pricing = () => {

    const {data , isPending : fetchPending, isSuccess : fetchSuccess} = useSuiClientQuery("getObject",{
        id : SubscriptionStoreId,
        options : {
          showContent : true,
          showOwner : true
        }
      });

    // console.log(data?.data?.content);
    // console.log(data?.data?.content.fields.subscriptions);


    if (fetchPending /*|| data.length < 3*/) {
        return <div className="flex justify-center items-center py-20">
            <div className="animate-spin mr-2">
                <CheckCircleIcon size={24} />
            </div>
            <span>Loading pricing plans...</span>
        </div>;
    }

    const pricingPlans = [
        {
            id : `0`,
            name: "Basic",
             //@ts-ignore
            price: `${(Number(data?.data?.content!.fields.subscriptions[0].fields.price) / (10 ** 8)).toFixed(2)}`,
            period: "per month",
            description: "Perfect for personal websites and small projects",
            features: [
                 //@ts-ignore
                `Monitor up to ${data?.data?.content.fields.subscriptions[0]?.fields.maxSitesAllowed} websites`,
                "Checks every 60 seconds",
                "10 geographic regions",
                "24 hour data retention",
                "Email notifications"
            ]
        },
        {
            id : `1`,
            name: "Pro",
            //@ts-ignore
            price: `${(Number(data?.data?.content.fields.subscriptions[1]?.fields.price) / (10 ** 8)).toFixed(2)}`,
            period: "per month",
            description: "Ideal for businesses with multiple websites",
            popular: true,
            features: [
                 //@ts-ignore
                `Monitor up to ${data?.data?.content.fields.subscriptions[1]?.fields.maxSitesAllowed} websites`,
                "Checks every 30 seconds",
                "7 geographic regions",
                "7 day data retention",
                "Email & SMS notifications",
                "API access"
            ]
        },
        {
            id : `2`,
            name: "Enterprise",
             //@ts-ignore
            price: `${(Number(data?.data?.content.fields.subscriptions[2]?.fields.price) / (10 ** 8)).toFixed(2)}`,
            period: "per month",
            description: "For large organizations with critical websites",
            features: [
                 //@ts-ignore
                `Monitor up to ${data?.data?.content.fields.subscriptions[2]?.fields.maxSitesAllowed} websites`,
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
                    <p className="text-gray-400">Pay with SUI for only what you use, with no hidden fees or long-term commitments.</p>
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
                                        <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">{plan.price} SUI</span>
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
                                    <PayButton plan={plan} index = {index}/>
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