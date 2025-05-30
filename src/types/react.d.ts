/// <reference types="react" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  export interface FC<P = {}> {
    (props: P): React.ReactElement | null;
  }

  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export type Key = string | number;

  export interface JSXElementConstructor<P> {
    (props: P): ReactElement<any, any> | null;
  }

  export interface ChangeEvent<T = Element> {
    target: T;
    currentTarget: T;
  }

  export interface FormEvent<T = Element> {
    target: T;
    currentTarget: T;
  }

  export interface MouseEvent<T = Element> {
    target: T;
    currentTarget: T;
  }

  export interface KeyboardEvent<T = Element> {
    target: T;
    currentTarget: T;
    key: string;
  }

  export interface HTMLInputElement extends Element {
    value: string;
    files: FileList | null;
    checked: boolean;
  }

  export interface FileList {
    readonly length: number;
    item(index: number): File | null;
    [index: number]: File;
  }

  export interface File {
    readonly name: string;
    readonly size: number;
    readonly type: string;
    readonly lastModified: number;
  }

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
} 