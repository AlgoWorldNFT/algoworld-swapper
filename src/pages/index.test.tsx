import { render, screen } from '@testing-library/react';
import Home from '@/pages/index.page';

describe(`Home`, () => {
  it(`renders a heading`, () => {
    render(<Home />);

    const heading = screen.getByRole(`heading`, {
      name: /Dashboard/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
