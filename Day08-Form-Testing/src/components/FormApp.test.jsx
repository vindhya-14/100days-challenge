import { render, screen, fireEvent } from '@testing-library/react';
import FormApp from './FormApp';

test('renders form and submits data correctly', () => {
  render(<FormApp />);

  const nameInput = screen.getByLabelText('name');
  const emailInput = screen.getByLabelText('email');
  const ageInput = screen.getByLabelText('age');
  const genderSelect = screen.getByLabelText('gender');
  const submitButton = screen.getByText('Submit');

  fireEvent.change(nameInput, { target: { value: 'Vindhya' } });
  fireEvent.change(emailInput, { target: { value: 'vindhya@example.com' } });
  fireEvent.change(ageInput, { target: { value: '21' } });
  fireEvent.change(genderSelect, { target: { value: 'female' } });

  fireEvent.click(submitButton);

  expect(screen.getByTestId('success-message')).toBeInTheDocument();
  expect(screen.getByText('Name: Vindhya')).toBeInTheDocument();

});
