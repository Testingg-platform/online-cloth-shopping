  import React, { useCallback } from 'react';
  import Particles from 'react-tsparticles';
  import { loadSlim } from 'tsparticles-slim';

  const InteractiveBackground = () => {
    const particlesInit = useCallback(async (engine) => {
      // This loads the slim version of tsparticles which contains the spider web effect
      await loadSlim(engine);
    }, []);

    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
          <Particles
            id="tsparticles"
            init={particlesInit}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            options={{
              fullScreen: { enable: true, zIndex: 0 },
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 120,
              interactivity: {
                detectsOn: "window",
                events: {
                  onHover: {
                    enable: true,
                    mode: "grab",
                  },
                },
                modes: {
                  grab: {
                    distance: 300,
                    links: {
                      opacity: 0.9,
                      color: "random"
                    },
                  },
                },
              },
              particles: {
                color: {
                  value: ["#FF5733", "#33FF57", "#3357FF", "#F033FF", "#33FFF0", "#FFD433"],
                },
                links: {
                  color: "random",
                  distance: 180,
                  enable: true,
                  opacity: 0.6,
                  width: 2,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 1.5,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 120,
                },
                opacity: {
                  value: 1,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 2, max: 4 },
                },
              },
              detectRetina: true,
            }}
          />
      </div>
    )
  }

  export default InteractiveBackground;
