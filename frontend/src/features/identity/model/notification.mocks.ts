import {
  NotificationType,
  type ListNotificationsParams,
  type Notification,
} from "./notification.types";

function createNotification(
  id: number,
  personId: number,
  type: NotificationType,
  content: string,
  read: boolean,
): Notification {
  return {
    id,
    personId,
    type,
    content,
    read,
  };
}

const notificationMocks: Notification[] = [
  createNotification(
    11,
    9,
    NotificationType.ATTENDANCE_REGISTERED,
    "Attendance was registered for today's basketball practice.",
    true,
  ),
  createNotification(
    12,
    9,
    NotificationType.OVERDUE_FEE,
    "There is an overdue membership fee pending.",
    false,
  ),
];

function filterNotificationMocks({
  personId,
  read,
}: ListNotificationsParams): Notification[] {
  return notificationMocks.filter((notification) => {
    const matchesPerson = notification.personId === personId;
    const matchesRead = typeof read !== "boolean" || notification.read === read;

    return matchesPerson && matchesRead;
  });
}

function markNotificationMockAsRead(notificationId: number): void {
  const notification = notificationMocks.find(
    (item) => item.id === notificationId,
  );

  if (!notification) {
    return;
  }

  notification.read = true;
}

function removeNotificationMock(notificationId: number): void {
  const notificationIndex = notificationMocks.findIndex(
    (item) => item.id === notificationId,
  );

  if (notificationIndex < 0) {
    return;
  }

  notificationMocks.splice(notificationIndex, 1);
}

export {
  notificationMocks,
  filterNotificationMocks,
  markNotificationMockAsRead,
  removeNotificationMock,
};
