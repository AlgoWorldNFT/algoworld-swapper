import { render, screen } from '@testing-library/react';
import PageHeader from '@/components/Headers/PageHeader';

it(`renders a heading`, () => {
  render(
    <PageHeader
      title="Test Header"
      description="This is a test description."
    />,
  );

  const heading = screen.getByRole(`heading`);

  expect(heading).toHaveTextContent(`Test Header`);
});
