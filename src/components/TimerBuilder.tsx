import { useState } from 'react';

import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';

import type { TimerBlock } from '../types/timer';

import {
  calculateTotalDuration,
  formatTime,
} from '../utils/timerEngine';

import {
  savePreset,
  loadPreset,
} from '../utils/storage';

interface Props {
  onStart: (
    blocks: TimerBlock[],
    rest: number,
    message: string,
  ) => void;
}

export default function TimerBuilder({
  onStart,
}: Props) {
  const [duration, setDuration] =
    useState('');

  const [repeat, setRepeat] =
    useState('');

  const [rest, setRest] =
    useState('5');

  const [message, setMessage] =
    useState(
      'Your next timer starts in...',
    );

  const [blocks, setBlocks] =
    useState<TimerBlock[]>([]);

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const addBlock = () => {
    if (!duration || !repeat) {
      return;
    }

    if (editingId) {
      setBlocks(
        blocks.map(block =>
          block.id ===
          editingId
            ? {
                ...block,
                duration:
                  Number(
                    duration,
                  ),
                repeat:
                  Number(
                    repeat,
                  ),
              }
            : block,
        ),
      );

      setEditingId(null);

      setDuration('');
      setRepeat('');

      return;
    }

    const newBlock: TimerBlock = {
      id: crypto.randomUUID(),
      duration: Number(duration),
      repeat: Number(repeat),
    };

    setBlocks([
      ...blocks,
      newBlock,
    ]);

    setDuration('');
    setRepeat('');
  };

  const deleteBlock = (
    id: string,
  ) => {
    setBlocks(
      blocks.filter(
        block =>
          block.id !== id,
      ),
    );
  };

  const editBlock = (
    block: TimerBlock,
  ) => {
    setDuration(
      String(
        block.duration,
      ),
    );

    setRepeat(
      String(
        block.repeat,
      ),
    );

    setEditingId(
      block.id,
    );
  };

  const handleSavePreset =
    () => {
      savePreset(
        blocks,
        Number(rest),
        message,
      );

      alert(
        'Preset saved successfully',
      );
    };

  const handleLoadPreset =
    () => {
      const preset =
        loadPreset();

      if (!preset) {
        alert(
          'No preset found',
        );
        return;
      }

      setBlocks(
        preset.blocks,
      );

      setRest(
        String(
          preset.rest,
        ),
      );

      setMessage(
        preset.message,
      );
    };

  const totalDuration =
    calculateTotalDuration(
      blocks,
      Number(rest),
    );

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Multi Interval Timer
      </Typography>

      <TextField
        label="Duration (seconds)"
        value={duration}
        type="number"
        onChange={e =>
          setDuration(
            e.target.value,
          )
        }
      />

      <TextField
        label="Repeat Count"
        value={repeat}
        type="number"
        onChange={e =>
          setRepeat(
            e.target.value,
          )
        }
      />

      <Button
        variant="contained"
        onClick={addBlock}
      >
        {editingId
          ? 'Update Block'
          : 'Add Timer Block'}
      </Button>

      {blocks.map(block => (
        <Paper
          key={block.id}
          sx={{
            p: 2,
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
          }}
        >
          <Typography>
            {block.duration}s ×{' '}
            {block.repeat}
          </Typography>

          <Stack
            direction="row"
          >
            <IconButton
              onClick={() =>
                editBlock(
                  block,
                )
              }
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() =>
                deleteBlock(
                  block.id,
                )
              }
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Paper>
      ))}

      <TextField
        label="Rest Interval (seconds)"
        value={rest}
        type="number"
        onChange={e =>
          setRest(
            e.target.value,
          )
        }
      />

      <TextField
        label="Custom Message"
        value={message}
        onChange={e =>
          setMessage(
            e.target.value,
          )
        }
      />

      <Paper
        sx={{
          p: 2,
          textAlign:
            'center',
        }}
      >
        <Typography variant="h6">
          Total Session Time
        </Typography>

        <Typography variant="h4">
          {formatTime(
            totalDuration,
          )}
        </Typography>
      </Paper>

      <Stack
        direction="row"
        spacing={2}
      >
        <Button
          variant="outlined"
          startIcon={
            <SaveIcon />
          }
          onClick={
            handleSavePreset
          }
        >
          Save
        </Button>

        <Button
          variant="outlined"
          startIcon={
            <DownloadIcon />
          }
          onClick={
            handleLoadPreset
          }
        >
          Load
        </Button>
      </Stack>

      <Button
        variant="contained"
        size="large"
        disabled={
          blocks.length === 0
        }
        onClick={() =>
          onStart(
            blocks,
            Number(rest),
            message,
          )
        }
      >
        Start Session
      </Button>
    </Stack>
  );
}