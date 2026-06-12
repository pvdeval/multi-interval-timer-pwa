export function speak(
  text: string,
) {
  try {
    if (
      !(
        'speechSynthesis' in
        window
      )
    ) {
      console.log(
        'Speech synthesis not supported',
      );
      return;
    }

    speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text,
      );

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart =
      () => {
        console.log(
          'Speech started:',
          text,
        );
      };

    utterance.onerror =
      (event) => {
        console.log(
          'Speech error:',
          event,
        );
      };

    speechSynthesis.speak(
      utterance,
    );
  } catch (error) {
    console.error(
      error,
    );
  }
}