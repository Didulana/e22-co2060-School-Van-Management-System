import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    const welcomeElement = await screen.findByText('Welcome Back');
    expect(welcomeElement).toBeInTheDocument();
  });
});
