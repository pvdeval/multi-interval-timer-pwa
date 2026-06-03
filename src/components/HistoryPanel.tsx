import {
  Paper,
  Typography,
  Stack,
} from '@mui/material';

interface Entry {
  date: string;
  duration: number;
}

interface Props {
  history: Entry[];
}

export default function HistoryPanel({
  history,
}: Props) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h6"
      >
        Session History
      </Typography>

      <Stack
        spacing={1}
      >
        {history.map(
          (
            item,
            index,
          ) => (
            <Typography
              key={
                index
              }
            >
              {
                new Date(
                  item.date,
                ).toLocaleString()
              }
              {' - '}
              {
                item.duration
              }
              s
            </Typography>
          ),
        )}
      </Stack>
    </Paper>
  );
}