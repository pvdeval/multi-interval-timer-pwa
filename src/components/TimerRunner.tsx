import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  LinearProgress,
  Stack,
  Typography,
  Paper,
} from '@mui/material';

import type {
  SessionStep,
} from '../types/timer';

import {
  formatTime,
} from '../utils/timerEngine';

import {
  beep,
} from '../utils/sound';

import {
  speak,
} from '../utils/speech';

interface Props {
  sequence: SessionStep[];
  message: string;
  onStop: () => void;
}

export default function TimerRunner({
  sequence,
  message,
  onStop,
}: Props) {
  const [index, setIndex] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [remaining, setRemaining] =
    useState(
      sequence[0]
        ?.duration ?? 0,
    );

  const moveToNextStep =
    () => {
      const nextIndex =
        index + 1;

      if (
        nextIndex >=
        sequence.length
      ) {
        /*sendNotification(
          'Session Complete',
          'Great Job!',
        );*/

        speak(
          'Session complete. Great job.'
        );

        setCompleted(
          true,
        );

        return;
      }

      const nextStep =
        sequence[nextIndex];

      beep();

      if (
        nextStep.type ===
        'timer'
      ) {
        speak(
          'Timer started'
        );
      } else {
        speak(
          'Rest interval'
        );
      }

      setIndex(
        nextIndex,
      );

      setRemaining(
        nextStep.duration,
      );
    };

  useEffect(() => {
    if (
      paused ||
      completed ||
      sequence.length === 0
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setRemaining(
          current => {
            if (
              current > 1
            ) {
              return (
                current - 1
              );
            }

            return 0;
          },
        );
      }, 1000);

    return () =>
      clearInterval(
        timer,
      );
  }, [
    paused,
    completed,
    sequence.length,
  ]);

  useEffect(() => {
    if (
      remaining === 0 &&
      !completed
    ) {
      moveToNextStep();
    }
  }, [
    remaining,
    completed,
  ]);

  if (completed) {
  return (
    <Stack
      spacing={4}
      sx={{
        alignItems: 'center',
        textAlign: 'center',
        py: 4,
      }}
    >
      <Typography
        variant="h1"
      >
        🎉
      </Typography>

      <Typography
        variant="h4"
        fontWeight="bold"
      >
        Workout Complete
      </Typography>

      <Typography
        color="text.secondary"
      >
        Great job finishing
        your session!
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={onStop}
      >
        Start New Session
      </Button>
    </Stack>
  );
}

  const current =
    sequence[index] ??
    null;

  if (!current) {
    return (
      <Typography>
        Loading...
      </Typography>
    );
  }

  const progress =
    sequence.length > 0
      ? ((index + 1) /
          sequence.length) *
        100
      : 0;

  return (
    <Stack
      spacing={3}
      sx={{
        alignItems:
          'center',
      }}
    >
    <Typography
  variant="h5"
  fontWeight="bold"
>
  Interval Trainer
</Typography>

<Typography
  color="text.secondary"
>
  Stay focused
</Typography>
      <LinearProgress
  variant="determinate"
  value={progress}
  sx={{
    width: '100%',
    height: 12,
    borderRadius: 6,
  }}
/>

      <div
  style={{
    width: 220,
    height: 220,
  }}
>
  <CircularProgressbar
    value={remaining}
    maxValue={
      current.duration
    }
    text={formatTime(
      remaining,
    )}
    styles={buildStyles({
      pathColor:
        current.type ===
        'timer'
          ? '#2563EB'
          : '#16A34A',
      trailColor:
        '#E5E7EB',
    })}
  />
</div>

      <Paper
  elevation={3}
  sx={{
    p: 3,
    width: '100%',
    textAlign: 'center',
    borderRadius: 3,
  }}
>
  <Typography
    variant="h6"
  >
    {current.type ===
    'timer'
      ? '🔥 Work Interval'
      : '🧘 Rest Interval'}
  </Typography>

  <Typography
    color="text.secondary"
    sx={{
      mt: 1,
    }}
  >
    Step {index + 1} of{' '}
    {sequence.length}
  </Typography>
</Paper>

      {current.type ===
  'rest' && (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      width: '100%',
      textAlign: 'center',
      borderRadius: 3,
    }}
  >
    <Typography
      color="primary"
      fontWeight="bold"
    >
      {message}
    </Typography>

    <Typography
      variant="h3"
      sx={{
        mt: 1,
      }}
    >
      {remaining}
    </Typography>
  </Paper>
)}

      <Stack
        direction="row"
        spacing={2}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            setPaused(
              !paused,
            )
          }
        >
          {paused
            ? 'Resume'
            : 'Pause'}
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={
            moveToNextStep
          }
        >
          Skip
        </Button>
      </Stack>

      <Button
        variant="outlined"
        size="large"
        color="error"
        onClick={onStop}
      >
        Stop Session
      </Button>
    </Stack>
  );
}