export async function requestNotificationPermission() {
  if (
    typeof window === 'undefined'
  ) {
    return;
  }

  if (
    !('Notification' in window)
  ) {
    return;
  }

  try {
    await Notification.requestPermission();
  } catch (error) {
    console.error(
      'Notification permission error:',
      error,
    );
  }
}

export function sendNotification(
  title: string,
  body: string,
) {
  try {
    if (
      typeof window ===
      'undefined'
    ) {
      return;
    }

    if (
      !('Notification' in window)
    ) {
      return;
    }

    if (
      Notification.permission !==
      'granted'
    ) {
      return;
    }

    new Notification(
      title,
      {
        body,
      },
    );
  } catch (error) {
    console.error(
      'Notification error:',
      error,
    );
  }
}