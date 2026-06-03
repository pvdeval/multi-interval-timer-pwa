export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return;
  }

  await Notification.requestPermission();
}

export function sendNotification(
  title: string,
  body: string,
) {
  if (
    Notification.permission === 'granted'
  ) {
    new Notification(title, {
      body,
    });
  }
}