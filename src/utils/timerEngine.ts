import type {
  TimerBlock,
  SessionStep,
} from '../types/timer';

/**
 * Converts timer blocks into a full execution sequence.
 *
 * Example:
 * 2 min × 2
 * 1 min × 1
 * Rest = 5 sec
 *
 * becomes:
 *
 * Timer 120
 * Rest 5
 * Timer 120
 * Rest 5
 * Timer 60
 */
export function buildSequence(
  blocks: TimerBlock[],
  restInterval: number,
): SessionStep[] {
  const sequence: SessionStep[] = [];

  blocks.forEach(block => {
    for (
      let i = 0;
      i < block.repeat;
      i++
    ) {
      sequence.push({
        type: 'timer',
        duration: block.duration,
      });

      sequence.push({
        type: 'rest',
        duration: restInterval,
      });
    }
  });

  // Remove last unnecessary rest interval
  if (sequence.length > 0) {
    sequence.pop();
  }

  return sequence;
}

/**
 * Converts seconds into MM:SS
 *
 * Example:
 * 125 -> 02:05
 */
export function formatTime(
  totalSeconds: number,
): string {
  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds =
    totalSeconds % 60;

  return `${String(
    minutes,
  ).padStart(
    2,
    '0',
  )}:${String(
    seconds,
  ).padStart(2, '0')}`;
}

/**
 * Calculates total session duration
 *
 * Includes rest intervals.
 *
 * Example:
 *
 * 120 x 3
 * 60 x 2
 * Rest 5 sec
 */
export function calculateTotalDuration(
  blocks: TimerBlock[],
  restInterval: number,
): number {
  let totalDuration = 0;

  let totalRepeats = 0;

  blocks.forEach(block => {
    totalDuration +=
      block.duration *
      block.repeat;

    totalRepeats +=
      block.repeat;
  });

  // Number of rests is always one less than total timer executions
  const totalRests =
    Math.max(
      totalRepeats - 1,
      0,
    );

  totalDuration +=
    totalRests *
    restInterval;

  return totalDuration;
}