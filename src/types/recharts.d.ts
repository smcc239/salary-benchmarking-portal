declare module 'recharts' {
  import { FC, ReactNode } from 'react';

  export interface ChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    children?: ReactNode;
  }

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: ReactNode;
  }

  export interface CartesianGridProps {
    strokeDasharray?: string;
    vertical?: boolean;
    horizontal?: boolean;
  }

  export interface XAxisProps {
    dataKey?: string;
    type?: 'number' | 'category';
    scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utc' | 'sequential' | 'threshold';
  }

  export interface YAxisProps {
    dataKey?: string;
    type?: 'number' | 'category';
    scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utc' | 'sequential' | 'threshold';
  }

  export interface TooltipProps {
    cursor?: boolean;
    content?: ReactNode | ((props: any) => ReactNode);
  }

  export interface BarProps {
    dataKey: string;
    fill?: string;
    stroke?: string;
  }

  export interface LineProps {
    type?: 'basis' | 'basisOpen' | 'basisClosed' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey: string;
    stroke?: string;
    strokeWidth?: number;
  }

  export interface AreaProps {
    type?: 'basis' | 'basisOpen' | 'basisClosed' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey: string;
    fill?: string;
    stroke?: string;
  }

  export interface PieProps {
    data: any[];
    dataKey: string;
    nameKey: string;
    cx?: number | string;
    cy?: number | string;
    innerRadius?: number | string;
    outerRadius?: number | string;
    fill?: string;
    stroke?: string;
  }

  export interface CellProps {
    fill?: string;
    stroke?: string;
  }

  export const BarChart: FC<ChartProps>;
  export const Bar: FC<BarProps>;
  export const XAxis: FC<XAxisProps>;
  export const YAxis: FC<YAxisProps>;
  export const CartesianGrid: FC<CartesianGridProps>;
  export const Tooltip: FC<TooltipProps>;
  export const ResponsiveContainer: FC<ResponsiveContainerProps>;
  export const PieChart: FC<ChartProps>;
  export const Pie: FC<PieProps>;
  export const Cell: FC<CellProps>;
  export const LineChart: FC<ChartProps>;
  export const Line: FC<LineProps>;
  export const AreaChart: FC<ChartProps>;
  export const Area: FC<AreaProps>;
} 