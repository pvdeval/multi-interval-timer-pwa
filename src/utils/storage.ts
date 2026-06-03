import type {
  TimerBlock,
} from '../types/timer';

const STORAGE_KEY =
  'multi_interval_timer_preset';

export function savePreset(
  blocks: TimerBlock[],
  rest: number,
  message: string,
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      blocks,
      rest,
      message,
    }),
  );
}

export function loadPreset() {
  const data =
    localStorage.getItem(
      STORAGE_KEY,
    );

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}