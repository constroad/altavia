import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import * as Three from 'three';

interface CylinderProps {
  volume: number;
}

const totalVolume = 100
const totalHeight = 50
const halfHeight = 25

export const Cylinder = ({ volume }: CylinderProps) => {
  console.log('Cylinder:', volume)
  const [geometry, setGeometry] = useState(
    new Three.CylinderGeometry(1, 1, 1, 32)
  );
  const [material, setMaterial] = useState(
    new Three.MeshBasicMaterial({ color: 'red' })
  );

  const [line, setLine] = useState<Three.Line>(new Three.Line(
    new Three.BufferGeometry().setFromPoints([
      new Three.Vector3(0, 0, 0),
      new Three.Vector3(0, 0.5, 0),
    ]),
    new Three.LineBasicMaterial({ color: 'blue' }),
  ));

  useEffect(() => {
    setGeometry(new Three.CylinderGeometry(1, 1, volume, 32));
    updateLineHeight(volume);
  }, [volume]);

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = new Three.WebGLRenderer({
      canvas: ref.current as HTMLCanvasElement,
    });
    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const mesh = new Three.Mesh(geometry, material);
    scene.add(mesh);

    scene.add(line);

    renderer.render(scene, camera);
  }, [volume]);

  const updateLineHeight = (volume: number) => {
    const lineHeight = volume >= (totalVolume / 2) ? totalHeight : halfHeight;
    // setLine(lineHeight)
  };

  return (
    <Box bgColor="white">
      <canvas ref={ref} />
    </Box>
  );
};
