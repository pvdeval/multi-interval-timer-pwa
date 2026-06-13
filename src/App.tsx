import {
  useEffect,
  useState,
} from 'react';

import {
  Container,
  Paper,
  Switch,
  Stack,
  Typography,
} from '@mui/material';

import {
  ThemeProvider,
  createTheme,
} from '@mui/material/styles';

import TimerBuilder from './components/TimerBuilder';
import TimerRunner from './components/TimerRunner';

import type {
  TimerBlock,
  SessionStep,
} from './types/timer';

import {
  buildSequence,
} from './utils/timerEngine';

import {
  requestNotificationPermission,
} from './utils/notifications';

import {
  unlockAudio,
  beep,
} from './utils/sound';

export default function App() {
  const [running, setRunning] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [sequence, setSequence] =
    useState<
      SessionStep[]
    >([]);

  const [darkMode,
    setDarkMode] =
    useState(false);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

 const theme =
  createTheme({
    palette: {
      mode:
        darkMode
          ? 'dark'
          : 'light',

      primary: {
        main:
          darkMode
            ? '#60A5FA'
            : '#2563EB',
      },

      background: {
        default:
          darkMode
            ? '#0F172A'
            : '#F8FAFC',
      },
    },
  });
  const startSession = (
    blocks: TimerBlock[],
    rest: number,
    msg: string,
  ) => {
    // iPhone Safari audio unlock
    unlockAudio();

    // temporary test beep
    // remove later if desired
    beep();

    const generatedSequence =
      buildSequence(
        blocks,
        rest,
      );

    setSequence(
      generatedSequence,
    );

    setMessage(msg);

    setRunning(true);
  };

  const stopSession =
    () => {
      setRunning(false);

      setSequence([]);

      setMessage('');
    };

  return (
    <ThemeProvider
      theme={theme}
    >
      <Container
        maxWidth="sm"
        sx={{
          mt: 2,
          mb: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems:
                'center',
              justifyContent:
                'flex-end',
              mb: 2,
            }}
          >
            <Typography>
              🌞
            </Typography>

            <Switch
              checked={
                darkMode
              }
              onChange={() =>
                setDarkMode(
                  !darkMode,
                )
              }
            />

            <Typography>
              🌙
            </Typography>
          </Stack>

          {!running ? (
            <TimerBuilder
              onStart={
                startSession
              }
            />
          ) : (
            <TimerRunner
              sequence={
                sequence
              }
              message={
                message
              }
              onStop={
                stopSession
              }
            />
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}