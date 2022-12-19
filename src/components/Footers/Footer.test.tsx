import renderWithProviders from '@/__utils__/renderWithProviders';
import Footer from './Footer';

describe(`Footer`, () => {
  it(`should render nav bar items`, () => {
    const { container } = renderWithProviders(<Footer />);

    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent(`Home`);
    expect(container).toHaveTextContent(`My Swaps`);
    expect(container).toHaveTextContent(`About`);
  });

  it(`should render reference buttons`, () => {
    const { container } = renderWithProviders(<Footer />);
    expect(container).toBeInTheDocument();
  });

  it(`should render copyright text`, () => {
    const { container } = renderWithProviders(<Footer />);

    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent(
      `Copyright © AlgoWorld ${new Date().getFullYear()}`,
    );
  });
});
