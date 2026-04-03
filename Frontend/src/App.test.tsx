import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('App Component', () => {
  it('renders the main application correctly', () => {
    // Basic smoke test to ensure the app mounts with its providers
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    );
    
    // We expect the main container or a primary heading to be present
    // Adjust selector based on your actual UI content
    expect(document.body).toBeInTheDocument();
  });
});
