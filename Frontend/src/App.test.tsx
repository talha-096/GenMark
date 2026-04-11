import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import App from './App';
import { AppProviders } from './providers/AppProviders';

describe('App Component', () => {
  it('renders the main application correctly', () => {
    // Wrap with AppProviders which includes QueryClient, Router, Auth, etc.
    render(
      <AppProviders>
        <App />
      </AppProviders>
    );
  });
});
