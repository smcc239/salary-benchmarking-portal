declare module 'react-router-dom' {
  import * as React from 'react';

  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
  }

  export const Route: React.FC<RouteProps>;
  export const Routes: React.FC<{ children?: React.ReactNode }>;
  export const Navigate: React.FC<{ to: string; replace?: boolean }>;
  export const BrowserRouter: React.FC<{ children?: React.ReactNode }>;
  export const Link: React.FC<{ to: string; className?: string; children?: React.ReactNode }>;
  export const useLocation: () => { pathname: string };
} 