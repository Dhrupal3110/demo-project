import { render, screen, fireEvent } from '@testing-library/react';
import ProgramList from '../ProgramList';

describe('ProgramList Component', () => {
  const mockPrograms = [
    {
      id: '1',
      name: 'Program 1',
      arrowId: '123',
      subscribeReference: 'SUB1',
      cedantName: 'Cedant 1',
    },
    {
      id: '2',
      name: 'Program 2',
      arrowId: '456',
      subscribeReference: 'SUB2',
      cedantName: 'Cedant 2',
    },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and programs', () => {
    render(
      <ProgramList
        programs={mockPrograms}
        onSelect={mockOnSelect}
        title="Test Title"
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText(/123, SUB1, Cedant 1, Program 1/)).toBeInTheDocument();
    expect(screen.getByText(/456, SUB2, Cedant 2, Program 2/)).toBeInTheDocument();
  });

  it('calls onSelect when play button is clicked', () => {
    render(
      <ProgramList
        programs={mockPrograms}
        onSelect={mockOnSelect}
        title="Test Title"
      />
    );

    // Find play buttons (they are inside buttons)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockOnSelect).toHaveBeenCalledWith(mockPrograms[0]);
  });

  it('renders empty list if no programs', () => {
    render(
      <ProgramList
        programs={[]}
        onSelect={mockOnSelect}
        title="Test Title"
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('filters out missing fields in display', () => {
    const incompleteProgram = [
      {
        id: '3',
        name: 'Program 3',
        arrowId: '',
        subscribeReference: null,
        cedantName: undefined,
      },
    ];

    render(
      <ProgramList
        programs={incompleteProgram as any}
        onSelect={mockOnSelect}
        title="Test Title"
      />
    );

    expect(screen.getByText('Program 3')).toBeInTheDocument();
    // Should not have commas for missing fields if logic is correct
    // The code is: [arrowId, subscribeReference, cedantName, name].filter(Boolean).join(', ')
    // So it should just be "Program 3"
    const span = screen.getByText('Program 3');
    expect(span.textContent).toBe('Program 3');
  });
});
