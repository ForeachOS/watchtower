import React from 'react';
import App from './App';
import { render } from '@testing-library/react';

it('renders without crashing', async () => {
  const { findByText } = render(<App />);
  await findByText('Watchtower');
});
