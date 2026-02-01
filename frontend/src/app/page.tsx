"use client";

import { useEffect, useState } from 'react';
import './App.css';
import FluidBackground from '@/components/FluidBackground';
import Navigation from '@/components/Navigation';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Advantages from './sections/Advantages';
import Team from './sections/Team';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

function App() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`relative min-h-screen bg-black transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Three.js Fluid Background */}
            <FluidBackground />

            {/* Noise Overlay */}
            <div className="noise-overlay" />

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="relative z-10">
                <Hero />
                <Features />
                <Advantages />
                <Team />
                <Contact />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default App;
