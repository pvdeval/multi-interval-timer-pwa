export function beep() {
  const audioContext =
    new (
      window.AudioContext ||
      (
        window as any
      ).webkitAudioContext
    )();

  const oscillator =
    audioContext.createOscillator();

  oscillator.connect(
    audioContext.destination,
  );

  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
  }, 150);
}