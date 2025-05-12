"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ConnectKitButton } from "connectkit";
import { Menu, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";


const Navbar = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const router = useRouter();
    return  <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/90 backdrop-blur-md shadow-lg' : ''}`}>
    <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
            <div className="flex items-center">
                <span className="text-cyan-400 mr-2">
                    <Zap size={24} />
                </span>
                <span className="font-bold text-xl tracking-tight hover:cursor-pointer" onClick={() => router.push('/')}>StatusDAO</span>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
                <a href="#features" className="text-gray-300 hover:text-cyan-400 transition">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition">How It Works</a>
                <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition">Pricing</a>
                <a href="#nodes" className="text-gray-300 hover:text-cyan-400 transition">Become a Node</a>
                <span className="text-gray-300 hover:text-cyan-400 transition hover:cursor-pointer" onClick={() => router.push('/dashboard')}>Dashboard</span>
            </div>

            <div className="justify-between flex flex-row items-center gap-x-10">
                <div>
                    <ConnectKitButton />
                </div>
                <div className='flex items-center'>
                    <SignedOut>
                        <div className='px-4 py-2 bg-gray-700 flex items-center justify-center w-24 rounded-full'>
                            <SignInButton/>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <div className='rounded-full bg-gray-700 w-10 h-10 items-center justify-center flex'>
                            <UserButton />
                        </div>
                    </SignedIn>
                </div>
            </div>

            <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    </div>

    {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-cyan-400 transition py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                <a href="#nodes" className="text-gray-300 hover:text-cyan-400 transition py-2" onClick={() => setMobileMenuOpen(false)}>Become a Node</a>
                <button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-2 rounded-full transition shadow-lg w-full">
                    Connect Wallet
                </button>
            </div>
        </div>
    )}
</header>
}


export default Navbar;