/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesContainer = () => {
  const particlesInit = async (main: any) => {
    await new Promise((r) => setTimeout(r, 100));
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        interactivity: {
          detectsOn: `window`,
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.2,
              size: 30,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: `#ff80bf`,
          },
          links: {
            color: `#ff80bf`,
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: `none`,
            enable: true,
            outMode: `bounce`,
            random: true,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              value_area: 800,
            },
            value: 40,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            options: {
              character: {
                fill: false,
                font: `Verdana`,
                style: ``,
                value: `*`,
                weight: `400`,
              },
              char: {
                fill: false,
                font: `Verdana`,
                style: ``,
                value: `*`,
                weight: `400`,
              },
              polygon: {
                sides: 5,
              },
              star: {
                sides: 5,
              },
              image: [
                {
                  src: `https://i.imgur.com/CI7mXuT.png`,
                },
                {
                  src: `https://i.imgur.com/UzKYM8V.png`,
                },
                {
                  src: `https://i.imgur.com/KuMx4jk.png`,
                },
                {
                  src: `https://i.imgur.com/zxKYgLQ.png`,
                },
                {
                  src: `https://i.imgur.com/8zMvcjr.png`,
                },
              ],
            },
            type: `image`,
          },
          size: {
            value: 10,
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesContainer;
