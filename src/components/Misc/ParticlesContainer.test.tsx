import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';
import ParticlesContainer from './ParticlesContainer';

const getById = queryByAttribute.bind(null, `id`);

describe(`ParticlesContainer`, () => {
  it(`renders the particle container correctly`, () => {
    const { container } = render(<ParticlesContainer />);
    const tsparticles = getById(container, `tsparticles`);
    expect(tsparticles).toBeInTheDocument();
  });
});
