declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export type Icon = FC<IconProps>;

  export const BarChart2: Icon;
  export const FileText: Icon;
  export const Users: Icon;
  export const Settings: Icon;
  export const Download: Icon;
  export const Eye: Icon;
  export const Lock: Icon;
  export const CheckCircle: Icon;
  export const AlertCircle: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const Search: Icon;
  export const Filter: Icon;
  export const Bell: Icon;
  export const BookmarkPlus: Icon;
  export const Share: Icon;
  export const TrendingUp: Icon;
  export const Calendar: Icon;
  export const Globe: Icon;
  export const Award: Icon;
  export const Zap: Icon;
  export const Target: Icon;
  export const Activity: Icon;
  export const DollarSign: Icon;
  export const Building: Icon;
  export const UserCheck: Icon;
  export const MessageSquare: Icon;
  export const Star: Icon;
  export const ArrowRight: Icon;
} 