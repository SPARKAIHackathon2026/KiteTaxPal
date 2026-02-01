"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// GLSL 顶点着色器：控制波浪起伏和鼠标扰动
const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uMouse;

  // 经典的 3D 噪声函数
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.y;
    vec4 y = y_ *ns.x + ns.y;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 基础噪声频率
    float noiseFreq = 0.4;
    float noiseAmp = 0.6;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime * 0.2, pos.y * noiseFreq, pos.z);
    
    // 计算位移 (Elevation)
    float elevation = snoise(noisePos) * noiseAmp;

    // 鼠标扰动：计算顶点距离鼠标的距离
    float mouseDist = distance(uv, uMouse);
    float mouseInfuence = smoothstep(0.5, 0.0, mouseDist);
    elevation += mouseInfuence * 0.4;

    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// GLSL 片元着色器：控制蓝底 + 粉橙渐变流动条纹
const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  void main() {
    // 基础深蓝色背景
    vec3 colorBlue = vec3(0.05, 0.1, 0.4); 
    // 粉色渐变
    vec3 colorPink = vec3(1.0, 0.4, 0.7);
    // 橙色渐变
    vec3 colorOrange = vec3(1.0, 0.6, 0.2);

    // 根据高度值混合粉色和橙色
    float mixFactor = smoothstep(-0.2, 0.5, vElevation);
    vec3 gradientColor = mix(colorPink, colorOrange, mixFactor);

    // 创建条纹效果 (使用 sin 函数基于 vUv 和时间)
    float stripe = sin(vUv.x * 10.0 + vUv.y * 5.0 + uTime * 1.5) * 0.5 + 0.5;
    
    // 最终颜色合成：背景 + 渐变流动
    vec3 finalColor = mix(colorBlue, gradientColor, stripe * (vElevation + 0.4));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const WaveMesh = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { viewport } = useThree();

    // 材质参数
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
    }), []);

    useFrame((state) => {
        const { clock, mouse } = state;
        // 更新时间
        uniforms.uTime.value = clock.getElapsedTime();
        // 映射鼠标坐标到 0-1 范围
        uniforms.uMouse.value.x = (mouse.x + 1) / 2;
        uniforms.uMouse.value.y = (mouse.y + 1) / 2;

        // 缓慢旋转平面增加动感
        meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width * 1.5, viewport.height * 1.5, 1]}>
            {/* 使用高精细度的平面网格，确保波浪平滑 */}
            <planeGeometry args={[1, 1, 128, 128]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                wireframe={false}
            />
        </mesh>
    );
};

export default function FlowingWaveCanvas() {
    return (
        <div className="fixed inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
                <WaveMesh />
            </Canvas>
        </div>
    );
}