import {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import type {
  SessionStep,
} from '../types/timer';

import {
  formatTime,
} from '../utils/timerEngine';

import {
  sendNotification,
} from '../utils/notifications';

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
        sendNotification(
          'Session Complete',
          'Great Job!',
        );

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
        spacing={3}
        sx={{
          alignItems:
            'center',
          textAlign:
            'center',
        }}
      >
        <Typography variant="h3">
          🎉 Session Complete
        </Typography>

        <Typography variant="h6">
          Great Job!
        </Typography>

        <Typography>
          All intervals
          finished.
        </Typography>

        <Button
          variant="contained"
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
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          width: '100%',
          height: 10,
        }}
      />

      <Typography variant="h1">
        {formatTime(
          remaining,
        )}
      </Typography>

      <Typography variant="h5">
        Step {index + 1} of{' '}
        {sequence.length}
      </Typography>

      <Typography variant="h6">
        Current:{' '}
        {current.type ===
        'timer'
          ? 'Timer'
          : 'Rest'}
      </Typography>

      {current.type ===
        'rest' && (
        <>
          <Typography>
            {message}
          </Typography>

          <Typography
            variant="h2"
            color="primary"
          >
            {remaining}
          </Typography>
        </>
      )}

      <Stack
        direction="row"
        spacing={2}
      >
        <Button
          variant="contained"
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
          onClick={
            moveToNextStep
          }
        >
          Skip
        </Button>
      </Stack>

      <Button
        variant="outlined"
        color="error"
        onClick={onStop}
      >
        Stop Session
      </Button>
    </Stack>
  );
}