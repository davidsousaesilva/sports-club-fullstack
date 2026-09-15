import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import {
  listNotifications,
  markNotificationAsRead,
  removeNotification,
} from "../api/notifications";
import type {
  Notification,
  NotificationFilter,
} from "../model/notification.types";

interface UseNotificationsOptions {
  personId: number;
}

interface UseNotificationsResult {
  activeFilter: NotificationFilter;
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  setActiveFilter: (filter: NotificationFilter) => void;
  markAsRead: UseMutationResult<void, Error, number>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: UseMutationResult<void, Error, number>;
}

const createNotificationsQueryKey = (
  personId: number,
): readonly [string, number] => ["identity-notifications", personId];

export const useNotifications = ({
  personId,
}: UseNotificationsOptions): UseNotificationsResult => {
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  const queryClient = useQueryClient();
  const queryKey = createNotificationsQueryKey(personId);

  const notificationsQuery = useQuery({
    queryKey,
    queryFn: () => listNotifications({ personId }),
    enabled: Number.isInteger(personId) && personId > 0,
    retry: false,
  });

  const markAsRead = useMutation<void, Error, number>({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteNotification = useMutation<void, Error, number>({
    mutationFn: (notificationId: number) => removeNotification(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const notifications = notificationsQuery.data ?? [];

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.read),
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const baseList =
      activeFilter === "unread" ? unreadNotifications : notifications;

    return [...baseList].sort((left, right) => right.id - left.id);
  }, [activeFilter, notifications, unreadNotifications]);

  const markAllAsRead = async (): Promise<void> => {
    const unreadIds = unreadNotifications.map(
      (notification) => notification.id,
    );

    await Promise.all(
      unreadIds.map((notificationId) => markNotificationAsRead(notificationId)),
    );

    await queryClient.invalidateQueries({ queryKey });
  };

  return {
    activeFilter,
    notifications: filteredNotifications,
    totalCount: notifications.length,
    unreadCount: unreadNotifications.length,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error as Error | null,
    setActiveFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
