import { useRef, useMemo } from 'react';
import { useTexture, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SignSystem = (props) => {
    const groupRef = useRef();
    // Blank wood sign (PORTFOLIO removed) — name rendered as crisp Text overlay
    const signTexture = useTexture('/textures/entrance/sign_blank.webp');
    const mountTexture = useTexture('/textures/entrance/belka.webp');

    const timeOffset = useMemo(() => Math.random() * 100, []);

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime + timeOffset;
            const windSway = Math.sin(time * 2) * 0.05;
            groupRef.current.rotation.x = windSway;
            groupRef.current.rotation.y = 0;
        }
    });

    return (
        <group {...props}>
            {/* Mounting bar */}
            <mesh position={[-0.05, 2.05, 0.65]}>
                <planeGeometry args={[2.7, 0.4]} />
                <meshBasicMaterial color="#e0e0e0" map={mountTexture} transparent={true} side={THREE.DoubleSide} />
            </mesh>

            {/* Hanging sign */}
            <group ref={groupRef} position={[0, 1.9, 0.60]}>
                <mesh position={[0, -0.5, 0]}>
                    <planeGeometry args={[2, 1]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        map={signTexture}
                        transparent={true}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>

                {/* Name — CabinSketch Bold (same as door signs), sized to sit inside the plank */}
                <group position={[0, -0.58, 0.02]}>
                    <Text
                        font="/fonts/CabinSketch-Bold.ttf"
                        fontSize={0.155}
                        color="#222222"
                        anchorX="center"
                        anchorY="bottom"
                        position={[0, 0.012, 0]}
                        letterSpacing={0.02}
                        maxWidth={1.35}
                        textAlign="center"
                        fillOpacity={1}
                        depthOffset={-1}
                    >
                        HARIS
                    </Text>
                    <Text
                        font="/fonts/CabinSketch-Bold.ttf"
                        fontSize={0.155}
                        color="#222222"
                        anchorX="center"
                        anchorY="top"
                        position={[0, -0.012, 0]}
                        letterSpacing={0.02}
                        maxWidth={1.35}
                        textAlign="center"
                        fillOpacity={1}
                        depthOffset={-1}
                    >
                        WASSAN
                    </Text>
                </group>
            </group>
        </group>
    );
};

export default SignSystem;
