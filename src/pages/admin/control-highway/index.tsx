import React, { useState } from 'react';
import {
  Cylinder,
  CylinderForm,
  CylinderGraph,
  IntranetLayout,
} from 'src/components';
import { Canvas } from '@react-three/fiber';

export const ControHighwayPage = () => {
  const [volume, setVolume] = useState(100);
  const [usedVolume, setUsedVolume] = useState(3000); // Volumen utilizado del cilindro en galones

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };
  return (
    <IntranetLayout>
      {/* <Cylinder volume={volume} /> */}
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <CylinderGraph volume={volume} usedVolume={usedVolume} />
      </Canvas>
      <CylinderForm onSubmit={handleVolumeChange} />
    </IntranetLayout>
  );
};

export default ControHighwayPage;
