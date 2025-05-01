
export interface AdUnit {
  id: string;
  name: string;
  position: string;
  code: string;
  active: boolean;
  priority?: "high" | "normal" | "low" | string;
  view_threshold?: number;
  frequency?: number;
  created_at?: string;
  updated_at?: string;
}
