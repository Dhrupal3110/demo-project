import { render, screen } from '@testing-library/react';
import { SectionTitle } from '../SectionTitle';

describe('SectionTitle', () => {
  test('renders title, subtitle, and description', () => {
    render(
      <SectionTitle
        title="Main Title"
        subtitle="Sub Title"
        description="Description text"
      />
    );
    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Sub Title')).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  test('applies custom class name', () => {
    const { container } = render(<SectionTitle title="Title" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
