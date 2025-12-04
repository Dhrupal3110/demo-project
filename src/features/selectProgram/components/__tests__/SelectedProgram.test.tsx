import { render, screen, fireEvent } from '@testing-library/react';
import SelectedProgram from '../SelectedProgram';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedProgram } from '@/features/selectProgram';

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock action creator
jest.mock('@/features/selectProgram', () => ({
  clearSelectedProgram: jest.fn(),
}));

describe('SelectedProgram', () => {
  const mockDispatch = jest.fn();
  const mockUseDispatch = useDispatch as unknown as jest.Mock;
  const mockUseSelector = useSelector as unknown as jest.Mock;
  const mockClearSelectedProgram = clearSelectedProgram as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  test('renders nothing when no program is selected', () => {
    mockUseSelector.mockReturnValue(null);
    const { container } = render(<SelectedProgram />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders program info when program is selected', () => {
    const mockProgram = { id: '123', name: 'Test Program' };
    mockUseSelector.mockReturnValue(mockProgram);

    render(<SelectedProgram />);

    expect(screen.getByText('Selected Program')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Test Program')).toBeInTheDocument();
  });

  test('dispatches clearSelectedProgram when close button is clicked', () => {
    const mockProgram = { id: '123', name: 'Test Program' };
    mockUseSelector.mockReturnValue(mockProgram);
    mockClearSelectedProgram.mockReturnValue({ type: 'clear' });

    render(<SelectedProgram />);

    // Find the button with X icon (or just the button)
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'clear' });
    expect(clearSelectedProgram).toHaveBeenCalled();
  });
});
