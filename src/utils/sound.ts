let audioContext:
  AudioContext | null =
  null;

function getAudioContext() {
  if (!audioContext) {
    audioContext =
      new (
        window.AudioContext ||
        (
          window as any
        ).webkitAudioContext
      )();
  }

  return audioContext;
}

export function beep(
  frequency = 880,
  duration = 150,
) {
  try {
    const ctx =
      getAudioContext();

    const oscillator =
      ctx.createOscillator();

    const gainNode =
      ctx.createGain();

    oscillator.connect(
      gainNode,
    );

    gainNode.connect(
      ctx.destination,
    );

    oscillator.frequency.value =
      frequency;

    gainNode.gain.value =
      0.2;

    oscillator.start();

    oscillator.stop(
      ctx.currentTime +
        duration / 1000,
    );
  } catch (error) {
    console.error(
      error,
    );
  }
}

export function doubleBeep() {
  beep();

  setTimeout(() => {
    beep();
  }, 250);
}

export function tripleBeep() {
  beep();

  setTimeout(() => {
    beep();
  }, 250);

  setTimeout(() => {
    beep();
  }, 500);
}