"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// 顶点着色器：处理波浪起伏
const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  // Simplex Noise 函数 (为了简洁省略部分具体实现，实际部署需完整包含)
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
    // 降低频率，让波浪更宽大平滑
    float noiseFreq = 0.6; 
    float noiseAmp = 0.35;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime * 0.1, pos.y * noiseFreq + uTime * 0.1, pos.z);
    
    float elevation = snoise(noisePos) * noiseAmp;
    vElevation = elevation;

    vec3 newPos = pos;
    newPos.z += elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

// 片元着色器：配色方案 (Blue Base + White/Grey/Black Stripes)
const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  void main() {
    // 基础色：深科技蓝
    vec3 colorDeepBlue = vec3(0.02, 0.05, 0.15);
    // 高亮色：冷白
    vec3 colorWhite = vec3(0.9, 0.95, 1.0);
    // 中间色：高级灰
    vec3 colorGrey = vec3(0.5, 0.6, 0.7);
    // 点缀色：微量赛博粉 (仅在波峰边缘)
    vec3 colorPink = vec3(1.0, 0.2, 0.6);

    // 混合因子
    float mixLevel = smoothstep(-0.2, 0.4, vElevation);
    
    // 生成流动的条纹纹理
    float stripes = sin(vUv.y * 20.0 + vUv.x * 10.0 + uTime * 0.5);
    stripes = smoothstep(0.4, 0.6, stripes);

    // 颜色混合逻辑
    vec3 baseColor = mix(colorDeepBlue, colorGrey, mixLevel * 0.6);
    // 在波峰处叠加白色条纹
    baseColor = mix(baseColor, colorWhite, stripes * mixLevel * 0.8);
    // 在极高处添加粉色光晕
    float highlight = smoothstep(0.25, 0.35, vElevation);
    baseColor = mix(baseColor, colorPink, highlight * 0.3);

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

const LiquidMesh = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { viewport } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
    }), []);

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[2, 2, 256, 256]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export default function FlowingLiquid() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 1.5], fov: 75 }}>
                <LiquidMesh />
            </Canvas>
        </div>
    );
}