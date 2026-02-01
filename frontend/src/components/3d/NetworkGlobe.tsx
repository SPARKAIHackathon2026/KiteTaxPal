"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// 生成随机点位数据
const GeneratePoints = () => {
    const pointsStr = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
        const i3 = i * 3;
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        pointsStr[i3] = 5 * Math.sin(theta) * Math.cos(phi);
        pointsStr[i3 + 1] = 5 * Math.sin(theta) * Math.sin(phi);
        pointsStr[i3 + 2] = 5 * Math.cos(theta);
    }
    return pointsStr;
}

const GlobeMesh = () => {
    const sphereRef = useRef<THREE.Mesh>(null!);
    const pointsRef = useRef<THREE.Points>(null!);
    const pointsData = GeneratePoints();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        // 让地球缓慢自转
        sphereRef.current.rotation.y = t * 0.1;
        // 让外面的点云反向缓慢旋转
        pointsRef.current.rotation.y = t * -0.05;
        pointsRef.current.rotation.z = t * 0.02;
    });

    return (
        <group scale={1.2}>
            {/* 核心球体：使用扭曲材质制造流动感 */}
            <Sphere ref={sphereRef} args={[4.8, 64, 64]}>
                <MeshDistortMaterial
                    color="#0e1624" // 深蓝黑色核心
                    attach="material"
                    distort={0.3} // 扭曲程度
                    speed={1.5} // 流动速度
                    roughness={0.4}
                    metalness={0.8}
                />
            </Sphere>

            {/* 外部点云网络：象征数据节点 */}
            <Points ref={pointsRef} positions={pointsData} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#06b6d4" // 青色节点
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>

            {/* 环境光和点光创造立体感 */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        </group>
    );
};

export default function NetworkGlobeCanvas() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                <color attach="background" args={["#000000"]} />
                {/* 迷雾效果增加深度感 */}
                <fog attach="fog" args={["#000000", 10, 25]} />
                <GlobeMesh />
                {/* 允许用户鼠标互动旋转，但禁用缩放和移动 */}
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}