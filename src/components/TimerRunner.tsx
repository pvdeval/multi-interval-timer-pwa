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
      if (
        index <
        sequence.length - 1
      ) {
        const next =
          index + 1;

        const nextStep =
          sequence[next];

        beep();

        if (
          nextStep.type ===
          'timer'
        ) {
          speak(
            'Timer started',
          );
        } else {
          speak(
            'Rest interval',
          );
        }

        setIndex(next);

        setRemaining(
          nextStep.duration,
        );
      } else {
        sendNotification(
          'Session Complete',
          'Great Job!',
        );

        speak(
          'Session complete. Great job.',
        );

        setCompleted(
          true,
        );
      }
    };

  useEffect(() => {
    if (
      paused ||
      completed
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setRemaining(prev => {
          if (prev > 1) {
            return prev - 1;
          }

          moveToNextStep();

          return 0;
        });
      }, 1000);

    return () =>
      clearInterval(
        interval,
      );
  }, [
    paused,
    completed,
    index,
  ]);

  if (completed) {
    return (
      <Stack
        spacing={3}
        alignItems="center"
      >
        <Typography variant="h3">
          🎉 Session Complete
        </Typography>

        <Typography variant="h6">
          Great Job!
        </Typography>

        <Typography>
          All intervals finished.
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
    sequence[index];

  const progress =
    ((index + 1) /
      sequence.length) *
    100;

  return (
    <Stack
      spacing={3}
      alignItems="center"
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
        Current:
        {' '}
        {current?.type ===
        'timer'
          ? 'Timer'
          : 'Rest'}
      </Typography>

      {current?.type ===
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