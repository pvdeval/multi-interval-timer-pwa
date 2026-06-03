export function speak(
  text: string,
) {
  if (
    !(
      'speechSynthesis' in
      window
    )
  ) {
    return;
  }

  const utterance =
    new SpeechSynthesisUtterance(
      text,
    );

  utterance.rate = 1;

  speechSynthesis.speak(
    utterance,
  );
}