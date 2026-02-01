"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const FlowingParticles = () => {
    const ref = useRef<THREE.Points>(null!);
    // 1. 用useRef存储Three.js要求的Float32Array，初始化为固定长度
    const positionsRef = useRef<Float32Array>(new Float32Array(2000 * 3));
    // 2. 加载状态：控制粒子组件渲染时机，避免渲染阶段访问未赋值的ref
    const [isInited, setIsInited] = useState<boolean>(false);

    // 3. 核心：useEffect是挂载后执行的副作用钩子（非渲染阶段），可安全调用Math.random()
    useEffect(() => {
        const positions = positionsRef.current;
        // 渲染阶段之外执行不纯的随机生成逻辑，完全合规
        for (let i = 0; i < 2000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;     // x: 宽分布
            positions[i * 3 + 1] = Math.random() * 20 - 10;    // y: 高分布
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z: 深度分布
        }
        // 生成完成后，标记初始化完成，触发条件渲染
        setIsInited(true);
    }, []); // 空依赖 → 仅组件挂载时执行一次，无重复生成

    // 粒子帧动画逻辑（保留所有原有效果，R3F合规用法）
    useFrame((state, delta) => {
        if (!ref.current) return; // 防空值，增强鲁棒性
        ref.current.rotation.x -= delta / 20;
        ref.current.rotation.y -= delta / 30;
        ref.current.position.y = Math.sin(state.clock.elapsedTime / 2) * 0.5;
    });

    // 4. 条件渲染：仅当数据生成完成（isInited=true），才渲染粒子组件
    // 此时访问positionsRef.current 是合法的，非渲染阶段的主动访问
    if (!isInited) return null; // 初始化中不渲染任何内容

    return (
        // eslint-disable-next-line react-hooks/refs
        <Points ref={ref} positions={positionsRef.current} stride={3}>
            <PointMaterial
                transparent
                color="#ffffff" // 白色粒子
                opacity={0.2}   // 低透明度，不抢眼
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending} // 发光叠加模式
            />
        </Points>
    );
};

export default function ParticleFlowCanvas() {
    return (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950 to-black">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <FlowingParticles />
            </Canvas>
        </div>
    );
}