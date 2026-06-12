let audioContext:
  AudioContext | null =
  null;

export function unlockAudio() {
  try {
    if (!audioContext) {
      audioContext =
        new (
          window.AudioContext ||
          (
            window as any
          ).webkitAudioContext
        )();
    }

    if (
      audioContext.state ===
      'suspended'
    ) {
      audioContext.resume();
    }
  } catch (error) {
    console.error(
      error,
    );
  }
}

export function beep() {
  try {
    if (!audioContext) {
      return;
    }

    const oscillator =
      audioContext.createOscillator();

    const gainNode =
      audioContext.createGain();

    oscillator.connect(
      gainNode,
    );

    gainNode.connect(
      audioContext.destination,
    );

    oscillator.frequency.value =
      880;

    gainNode.gain.value =
      0.2;

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
        0.15,
    );
  } catch (error) {
    console.error(
      error,
    );
  }
}