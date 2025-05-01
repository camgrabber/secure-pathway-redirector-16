
export interface AdUnit {
  id: string;
  name: string;
  position: string;
  code: string;
  active: boolean;
  priority?: 'high' | 'normal' | 'low';
  viewThreshold?: number;
  frequency?: number;
}
