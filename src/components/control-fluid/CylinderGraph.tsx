import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface CylinderProps {
  volume: number;
  usedVolume: number;
}
export const CylinderGraph = ({ volume, usedVolume }: CylinderProps) => {
  const cylinderRef = useRef();
  const lineRef = useRef();

  // Actualiza la altura del cilindro en función del volumen
  useFrame(() => {
    if (cylinderRef.current) {
      //@ts-ignore
      cylinderRef.current.scale.y = volume / 100; // Escala la altura del cilindro
    }
    if (lineRef.current) {
      //@ts-ignore
      lineRef.current.geometry.dispose(); // Limpia la geometría anterior
      const points = [
        new Vector3(0, usedVolume / 8000, 0), // Punto de inicio de la línea
        new Vector3(0, volume / 100, 0), // Punto final de la línea
      ];
      //@ts-ignore
      lineRef.current.points = points;
      //@ts-ignore
      lineRef.current.computeLineDistances();
    }
  });

  return (
    <>
      {/* <Cylinder
        //@ts-ignore
        ref={cylinderRef}
        args={[1, 1, 2, 32]} // radio superior, radio inferior, altura, segmentos
        position={[0, 0, 0]}
      >
        <meshPhongMaterial attach="material" color="blue" />
      </Cylinder> */}
      <Cylinder
        //@ts-ignore
        ref={cylinderRef}
        args={[1, 1, 2, 32]} // radio superior, radio inferior, altura, segmentos
        position={[0, 0, 0]}
      />
      <Line
        //@ts-ignore
        ref={lineRef}
        points={[
          new Vector3(0, usedVolume / 8000, 0), // Punto de inicio de la línea
          new Vector3(0, volume / 100, 0), // Punto final de la línea
        ]}
        color="red"
        linewidth={5}
        dashed={false}
      />
    </>
  );
};
