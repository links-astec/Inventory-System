declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  
  export type LucideIcon = ComponentType<LucideProps>;
  
  export const Users: LucideIcon;
  export const Package: LucideIcon;
  export const DollarSign: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const LogOut: LucideIcon;
  export const FileText: LucideIcon;
  export const Settings: LucideIcon;
  export const Search: LucideIcon;
  export const BarChart3: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Shield: LucideIcon;
  export const Eye: LucideIcon;
  export const ArrowRight: LucideIcon;
}
