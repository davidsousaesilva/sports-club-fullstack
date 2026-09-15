export enum NotificationType {
  ATHLETE_REGISTERED_TEAM = "ATHLETE_REGISTERED_TEAM",
  ATHLETE_REGISTERED_COMPETITION = "ATHLETE_REGISTERED_COMPETITION",
  ATHLETE_REGISTERED_EVENT = "ATHLETE_REGISTERED_EVENT",
  TRAINING_SCHEDULED = "TRAINING_SCHEDULED",
  TRAINING_PERFORMANCE = "TRAINING_PERFORMANCE",
  EVENT_PERFORMANCE = "EVENT_PERFORMANCE",
  EVENT_RESULT = "EVENT_RESULT",
  COMPETITION_RESULT = "COMPETITION_RESULT",
  FEE_PAID = "FEE_PAID",
  TRAINING_MISSED = "TRAINING_MISSED",
  ATTENDANCE_REGISTERED = "ATTENDANCE_REGISTERED",
  OVERDUE_FEE = "OVERDUE_FEE",
}

export interface Notification {
  id: number;
  type: NotificationType;
  content: string;
  read: boolean;
  personId: number;
}

export type NotificationFilter = "all" | "unread";

export interface ListNotificationsParams {
  personId: number;
  read?: boolean;
}
