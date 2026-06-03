const KEY =
  'timer-history';

export function saveHistory(
  duration: number,
) {
  const existing =
    JSON.parse(
      localStorage.getItem(
        KEY,
      ) || '[]',
    );

  existing.unshift({
    date:
      new Date().toISOString(),
    duration,
  });

  localStorage.setItem(
    KEY,
    JSON.stringify(
      existing,
    ),
  );
}

export function getHistory() {
  return JSON.parse(
    localStorage.getItem(
      KEY,
    ) || '[]',
  );
}