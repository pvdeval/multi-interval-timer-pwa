export interface TimerBlock {
  id: string;
  duration: number;
  repeat: number;
}

export interface SessionConfig {
  blocks: TimerBlock[];
  restInterval: number;
  message: string;
}

export interface SessionStep {
  type: 'timer' | 'rest';
  duration: number;
}