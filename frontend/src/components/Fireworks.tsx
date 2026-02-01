"use client";

import React, { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    life: number;
}

interface Firework {
    id: number;
    x: number;
    y: number;
    targetY: number;
    color: string;
    exploded: boolean;
    particles: Particle[];
}

export default function Fireworks({ trigger }: { trigger: boolean }) {
    const [fireworks, setFireworks] = useState<Firework[]>([]);

    useEffect(() => {
        if (!trigger) return;

        const colors = ['#3898EC', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        const newFireworks: Firework[] = [];

        // Create multiple fireworks
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const firework: Firework = {
                    id: Date.now() + i,
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight,
                    targetY: window.innerHeight * 0.2 + Math.random() * window.innerHeight * 0.3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    exploded: false,
                    particles: []
                };
                
                setFireworks(prev => [...prev, firework]);
            }, i * 200);
        }

        // Clean up after animation
        const timer = setTimeout(() => {
            setFireworks([]);
        }, 4000);

        return () => clearTimeout(timer);
    }, [trigger]);

    useEffect(() => {
        if (fireworks.length === 0) return;

        const interval = setInterval(() => {
            setFireworks(prevFireworks => 
                prevFireworks.map(fw => {
                    if (!fw.exploded) {
                        // Move firework upward
                        const newY = fw.y - 8;
                        if (newY <= fw.targetY) {
                            // Explode and create particles
                            const particles: Particle[] = [];
                            for (let i = 0; i < 30; i++) {
                                const angle = (Math.PI * 2 * i) / 30;
                                const velocity = 2 + Math.random() * 4;
                                particles.push({
                                    id: i,
                                    x: fw.x,
                                    y: fw.y,
                                    vx: Math.cos(angle) * velocity,
                                    vy: Math.sin(angle) * velocity,
                                    color: fw.color,
                                    size: 2 + Math.random() * 2,
                                    life: 1
                                });
                            }
                            return { ...fw, y: newY, exploded: true, particles };
                        }
                        return { ...fw, y: newY };
                    } else {
                        // Update particles
                        const updatedParticles = fw.particles.map(p => ({
                            ...p,
                            x: p.x + p.vx,
                            y: p.y + p.vy,
                            vy: p.vy + 0.1, // gravity
                            life: p.life - 0.02
                        })).filter(p => p.life > 0);

                        return { ...fw, particles: updatedParticles };
                    }
                }).filter(fw => fw.exploded || fw.y > fw.targetY)
            );
        }, 16);

        return () => clearInterval(interval);
    }, [fireworks.length]);

    if (fireworks.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            <svg className="w-full h-full">
                {fireworks.map(fw => (
                    <g key={fw.id}>
                        {!fw.exploded && (
                            <circle
                                cx={fw.x}
                                cy={fw.y}
                                r="3"
                                fill={fw.color}
                                className="drop-shadow-lg"
                            />
                        )}
                        {fw.particles.map(particle => (
                            <circle
                                key={`${fw.id}-${particle.id}`}
                                cx={particle.x}
                                cy={particle.y}
                                r={particle.size}
                                fill={particle.color}
                                opacity={particle.life}
                                className="drop-shadow-sm"
                            />
                        ))}
                    </g>
                ))}
            </svg>
        </div>
    );
}
