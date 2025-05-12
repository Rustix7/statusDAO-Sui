"use client"
import { ArrowRightIcon, CheckCircleIcon, XCircleIcon, GlobeIcon, Zap, Shield, CreditCard } from 'lucide-react';
import Pricing from './components/pricing';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';

const Home = () => {
    const router = useRouter();

    return (
        <div className="bg-slate-950 text-gray-100 min-h-screen font-sans">
            {/* Header */}
            <Navbar/>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 blur-3xl"></div>
                    <div className="absolute -left-40 top-60 w-96 h-96 rounded-full bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-1 text-xs font-semibold tracking-wider bg-cyan-900/30 text-cyan-400 rounded-full">DECENTRALIZED MONITORING</div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                                Know when your sites are <span className="bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">down</span> before your users do
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl">
                                StatusDAO monitors your websites in real-time through a decentralized network of nodes with WebSocket technology and transparent Ethereum payments.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 py-3 rounded-full transition font-medium flex items-center justify-center group" onClick={() => router.push('/dashboard')}>
                                    Start Monitoring
                                    <ArrowRightIcon size={18} className="ml-2 transition transform group-hover:translate-x-1" />
                                </button>
                                <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full transition font-medium border border-slate-700">
                                    Learn More
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400 pt-2">
                                <div className="flex items-center">
                                    <CheckCircleIcon size={18} className="text-teal-500 mr-2" />
                                    <span>No Credit Card</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon size={18} className="text-teal-500 mr-2" />
                                    <span>ETH Payments</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon size={18} className="text-teal-500 mr-2" />
                                    <span>Real-time</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl blur opacity-30"></div>
                            <div className="relative bg-slate-900 rounded-2xl p-8 backdrop-blur-sm backdrop-filter border border-slate-800/50">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold text-lg">Website Status Dashboard</h3>
                                    <div className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                                        <span className="bg-slate-800 px-3 py-1 rounded-full text-xs">LIVE</span>
                                    </div>
                                </div>

                                {[
                                    { url: 'myecommerce.com', status: 'online', responseTime: '45ms' },
                                    { url: 'blog.mysite.io', status: 'online', responseTime: '87ms' },
                                    { url: 'api.myservice.net', status: 'offline', responseTime: '-' },
                                    { url: 'dashboard.myapp.com', status: 'online', responseTime: '120ms' },
                                ].map((site, index) => (
                                    <div key={index} className="flex items-center justify-between bg-slate-800/30 rounded-xl p-4 mb-3 backdrop-blur-sm border border-slate-700/30">
                                        <div className="flex items-center">
                                            <GlobeIcon size={18} className="text-gray-400 mr-3" />
                                            <span className="text-gray-200">{site.url}</span>
                                        </div>
                                        <div className="flex items-center">
                                            {site.status === 'online' ? (
                                                <span className="flex items-center text-teal-400">
                                                    <CheckCircleIcon size={18} className="mr-2" />
                                                    {site.responseTime}
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-400">
                                                    <XCircleIcon size={18} className="mr-2" />
                                                    Down
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4">
                                    <div className="animate-pulse flex space-x-2 justify-center">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 relative">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute left-20 top-40 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-block px-4 py-1 text-xs font-semibold tracking-wider bg-teal-900/30 text-teal-400 rounded-full mb-4">WHY CHOOSE US</div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Not Your Average Monitoring</h2>
                        <p className="text-gray-400">Our decentralized approach offers advantages that traditional centralized services simply can't match.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap size={24} />,
                                title: "Real-time Monitoring",
                                description: "Get instant notifications when your website goes down, with updates every 15 seconds from multiple geographic locations."
                            },
                            {
                                // icon: <CubeTransparent size={24} />,
                                title: "Decentralized Network",
                                description: "Our network of independent nodes ensures higher reliability and eliminates central points of failure."
                            },
                            {
                                icon: <Shield size={24} />,
                                title: "Transparent Payments",
                                description: "All transactions are recorded on the Ethereum blockchain, ensuring full transparency and fairness."
                            },
                            {
                                icon: <CreditCard size={24} />,
                                title: "Pay-as-you-go",
                                description: "Only pay for the monitoring you actually use, with flexible subscription options via ETH."
                            },
                            {
                                icon: <GlobeIcon size={24} />,
                                title: "Global Coverage",
                                description: "Nodes span across different regions, giving you accurate status from various geographic locations."
                            },
                            {
                                icon: <CheckCircleIcon size={24} />,
                                title: "Smart Contract Security",
                                description: "Node payments and user subscriptions are managed through secure, audited smart contracts."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="group p-0.5 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-teal-500/0 hover:from-cyan-500 hover:to-teal-500 transition-all duration-300">
                                <div className="bg-slate-900 rounded-2xl p-6 h-full backdrop-blur-sm backdrop-filter border border-slate-800/50 transition-all">
                                    <div className="text-cyan-400 group-hover:text-white mb-4 p-3 bg-slate-800/50 inline-block rounded-xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-slate-900/50 relative">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute right-20 top-40 w-96 h-96 rounded-full bg-gradient-to-bl from-cyan-500/20 to-teal-500/20 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-block px-4 py-1 text-xs font-semibold tracking-wider bg-cyan-900/30 text-cyan-400 rounded-full mb-4">PROCESS</div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">How StatusDAO Works</h2>
                        <p className="text-gray-400">Our websocket-powered architecture enables real-time monitoring with maximum reliability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                number: "01",
                                title: "Connect Your Website",
                                description: "Add your website URLs to the platform and choose your monitoring parameters."
                            },
                            {
                                number: "02",
                                title: "Nodes Monitor Status",
                                description: "Our decentralized node network continuously checks your website's availability and performance."
                            },
                            {
                                number: "03",
                                title: "Get Real-time Alerts",
                                description: "Receive instant notifications when issues are detected, with detailed diagnostic information."
                            }
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <div className="border border-slate-800 bg-slate-900/80 rounded-2xl p-8 h-full backdrop-blur-sm backdrop-filter">
                                    <div className="text-cyan-400/20 text-6xl font-bold mb-6">{step.number}</div>
                                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                                    <p className="text-gray-400">{step.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-teal-500">
                                        <ArrowRightIcon size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 border border-slate-800 bg-slate-900/80 rounded-2xl p-8 backdrop-blur-sm backdrop-filter">
                        <h3 className="text-2xl font-bold mb-6">Technical Architecture</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <p className="text-gray-400 mb-4">
                                    StatusDAO uses a hub-and-spoke model with WebSocket connections to ensure real-time monitoring:
                                </p>
                                <ul className="space-y-3 text-gray-400">
                                    <li className="flex items-start">
                                        <div className="text-teal-500 mr-3 mt-1"><CheckCircleIcon size={18} /></div>
                                        <span>The central hub distributes monitoring tasks to connected nodes via WebSockets</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="text-teal-500 mr-3 mt-1"><CheckCircleIcon size={18} /></div>
                                        <span>Nodes perform status checks and immediately report results back to the hub</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="text-teal-500 mr-3 mt-1"><CheckCircleIcon size={18} /></div>
                                        <span>The hub aggregates results and updates status in real-time</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="text-teal-500 mr-3 mt-1"><CheckCircleIcon size={18} /></div>
                                        <span>Ethereum smart contracts handle subscriptions and node payments transparently</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-teal-500/50 rounded-xl blur-sm opacity-30"></div>
                                <div className="bg-slate-900 p-6 rounded-xl relative border border-slate-800/50">
                                    <div className="w-full h-64 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-cyan-400 mb-2">
                                                {/* <CubeTransparent size={48} /> */}
                                            </div>
                                            <p className="text-sm text-gray-400">Architecture Diagram</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <Pricing/>

            {/* Become a Node */}
            <section id="nodes" className="py-20 bg-slate-900/50 relative">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute right-20 bottom-20 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-block px-4 py-1 text-xs font-semibold tracking-wider bg-cyan-900/30 text-cyan-400 rounded-full mb-4">JOIN THE NETWORK</div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Become a Node Operator</h2>
                            <p className="text-gray-400 mb-6">
                                Earn ETH by contributing to our decentralized monitoring network. Run a node on your server and get paid automatically through smart contracts.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Minimum uptime requirement of 99%",
                                    "Automatic payments based on monitoring performance",
                                    "Simple docker container setup",
                                    "Contribute to a more resilient web"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="text-teal-500 mr-3 mt-1"><CheckCircleIcon size={18} /></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 py-3 rounded-full transition font-medium">
                                Apply to Run a Node
                            </button>
                        </div>
                        <div className="border border-slate-800 bg-slate-900/80 rounded-2xl p-8 backdrop-blur-sm backdrop-filter">
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Node Rewards</h3>
                                <p className="text-gray-400">Estimated monthly earnings based on node performance:</p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { level: "Basic", availability: "99%", earnings: "0.02 ETH" },
                                    { level: "Standard", availability: "99.5%", earnings: "0.05 ETH" },
                                    { level: "Premium", availability: "99.9%", earnings: "0.1 ETH" }
                                ].map((tier, index) => (
                                    <div key={index} className="bg-slate-800/50 rounded-xl p-4 flex justify-between items-center border border-slate-700/20">
                                        <div>
                                            <h4 className="font-medium">{tier.level} Node</h4>
                                            <p className="text-sm text-gray-400">Uptime: {tier.availability}+</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gradient bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">{tier.earnings}</p>
                                            <p className="text-sm text-gray-400">per month</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    )
}

export default Home;