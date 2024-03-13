

import React, { useState } from 'react';

interface FormProps {
  onSubmit: (volume: number) => void;
}

export const CylinderForm = ({ onSubmit }: FormProps) => {
  const [volume, setVolume] = useState(0.5);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(volume);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="volume" value={volume} onChange={(e) => setVolume(e.target.valueAsNumber)} />
      <button type="submit">Enviar</button>
    </form>
  );
};