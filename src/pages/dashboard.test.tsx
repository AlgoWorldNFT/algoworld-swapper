import { render, screen } from '@testing-library/react';
import Dashboard from '@/pages/dashboard.page';

describe(`Dashboard`, () => {
  it(`renders a heading`, () => {
    render(<Dashboard />);

    const heading = screen.getByRole(`heading`, {
      name: /Dashboard/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
