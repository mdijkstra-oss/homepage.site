import type { ReactNode } from 'react';
import { DecorativeBackdrop, Grid, Vignette } from './BackgroundLayers';

interface BackgroundProps {
  children: ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  return (
    <>
      <DecorativeBackdrop />
      {children}
      <Grid />
      <Vignette />
    </>
  );
}
