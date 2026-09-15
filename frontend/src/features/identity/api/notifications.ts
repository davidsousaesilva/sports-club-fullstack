import { httpClient } from "../../../lib/api/http-client";

import type {
  ListNotificationsParams,
  Notification,
} from "../model/notification.types";

const buildNotificationsPath = ({
  personId,
  read,
}: ListNotificationsParams): string => {
  const searchParams = new URLSearchParams();

  if (typeof read === "boolean") {
    searchParams.set("read", String(read));
  }

  const query = searchParams.toString();

  return query
    ? `/api/people/${personId}/notifications?${query}`
    : `/api/people/${personId}/notifications`;
};

export const listNotifications = async (
  params: ListNotificationsParams,
): Promise<Notification[]> => {
  return httpClient.get<Notification[]>(buildNotificationsPath(params));
};

export const markNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  await httpClient.post<void>(`/api/notifications/${notificationId}/read`);
};

export const removeNotification = async (
  notificationId: number,
): Promise<void> => {
  await httpClient.delete<void>(`/api/notifications/${notificationId}`);
};
