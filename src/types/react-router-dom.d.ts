declare module 'react-router-dom' {
  import { ComponentType, ReactNode } from 'react';

  export interface RouteObject {
    caseSensitive?: boolean;
    children?: RouteObject[];
    element?: ReactNode;
    index?: boolean;
    path?: string;
  }

  export interface NavigateFunction {
    (to: string, options?: { replace?: boolean; state?: any }): void;
  }

  export interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
  }

  export function useNavigate(): NavigateFunction;
  export function useLocation(): Location;

  export const Routes: ComponentType<{ children?: ReactNode }>;
  export const Route: ComponentType<RouteObject>;
  export const Navigate: ComponentType<{ to: string; replace?: boolean }>;
  export const Link: ComponentType<{ to: string; className?: string; children?: ReactNode }>;
  export const BrowserRouter: ComponentType<{ children?: ReactNode }>;
} 