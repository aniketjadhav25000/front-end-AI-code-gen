import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const options = {
    fullScreen: { enable: false },
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
      opacity: { value: 0.2, random: true },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 0.3,
        direction: 'none',
        out_mode: 'out'
      },
      links: {
        enable: true,
        distance: 150,
        color: '#ffffff',
        opacity: 0.1,
        width: 1
      }
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 200, links: { opacity: 0.4 } },
        push: { quantity: 4 }
      }
    },
    retina_detect: true
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="fixed inset-0 -z-10"
    />
  );
}
