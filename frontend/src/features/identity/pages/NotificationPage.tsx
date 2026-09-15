import { useMemo } from "react";
import {
  AlertCircle,
  Bell,
  BellOff,
  Calendar,
  CalendarCheck,
  CheckCircle,
  Euro,
  Loader2,
  Trophy,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { Card } from "../../../shared/components/ui/card/Card";
import { cn } from "../../../lib/utils/cn";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { useNotifications } from "../hooks/use-notifications";
import {
  NotificationType,
  type Notification,
} from "../model/notification.types";

interface NotificationVisualConfig {
  icon: LucideIcon;
  iconClassName: string;
  cardClassName: string;
}

const NOTIFICATION_VISUALS: Record<NotificationType, NotificationVisualConfig> =
  {
    [NotificationType.ATHLETE_REGISTERED_TEAM]: {
      icon: Users,
      iconClassName: "text-blue-600",
      cardClassName: "border-blue-200 bg-blue-50/60",
    },
    [NotificationType.ATHLETE_REGISTERED_COMPETITION]: {
      icon: Trophy,
      iconClassName: "text-yellow-600",
      cardClassName: "border-yellow-200 bg-yellow-50/60",
    },
    [NotificationType.ATHLETE_REGISTERED_EVENT]: {
      icon: CalendarCheck,
      iconClassName: "text-green-600",
      cardClassName: "border-green-200 bg-green-50/60",
    },
    [NotificationType.TRAINING_SCHEDULED]: {
      icon: Calendar,
      iconClassName: "text-violet-600",
      cardClassName: "border-violet-200 bg-violet-50/60",
    },
    [NotificationType.TRAINING_PERFORMANCE]: {
      icon: TrendingUp,
      iconClassName: "text-indigo-600",
      cardClassName: "border-indigo-200 bg-indigo-50/60",
    },
    [NotificationType.EVENT_PERFORMANCE]: {
      icon: TrendingUp,
      iconClassName: "text-indigo-600",
      cardClassName: "border-indigo-200 bg-indigo-50/60",
    },
    [NotificationType.EVENT_RESULT]: {
      icon: Trophy,
      iconClassName: "text-amber-600",
      cardClassName: "border-amber-200 bg-amber-50/60",
    },
    [NotificationType.COMPETITION_RESULT]: {
      icon: Trophy,
      iconClassName: "text-amber-600",
      cardClassName: "border-amber-200 bg-amber-50/60",
    },
    [NotificationType.FEE_PAID]: {
      icon: Euro,
      iconClassName: "text-emerald-600",
      cardClassName: "border-emerald-200 bg-emerald-50/60",
    },
    [NotificationType.TRAINING_MISSED]: {
      icon: AlertCircle,
      iconClassName: "text-rose-600",
      cardClassName: "border-rose-200 bg-rose-50/60",
    },
    [NotificationType.ATTENDANCE_REGISTERED]: {
      icon: CheckCircle,
      iconClassName: "text-green-600",
      cardClassName: "border-green-200 bg-green-50/60",
    },
    [NotificationType.OVERDUE_FEE]: {
      icon: AlertCircle,
      iconClassName: "text-orange-600",
      cardClassName: "border-orange-200 bg-orange-50/60",
    },
  };

const FALLBACK_VISUAL: NotificationVisualConfig = {
  icon: Bell,
  iconClassName: "text-slate-600",
  cardClassName: "border-slate-200 bg-slate-50/60",
};

const formatUnreadCountLabel = (count: number): string => {
  if (count === 0) {
    return "Todas lidas";
  }

  return `${count} notificação${count === 1 ? "" : "ões"} por ler`;
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  isUpdating,
  isDeleting,
}: {
  notification: Notification;
  onMarkAsRead: (notificationId: number) => void;
  onDelete: (notificationId: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}) => {
  const visual = NOTIFICATION_VISUALS[notification.type] ?? FALLBACK_VISUAL;
  const Icon = visual.icon;

  return (
    <Card
      className={cn(
        "border-l-4 p-4 transition-colors",
        visual.cardClassName,
        !notification.read && "bg-white",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="mt-1 shrink-0">
          <Icon className={cn("h-5 w-5", visual.iconClassName)} />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm text-slate-900",
              !notification.read ? "font-semibold" : "font-normal",
            )}
          >
            {notification.content}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              disabled={isUpdating || isDeleting}
              aria-label="Marcar notificação como lida"
              title="Marcar notificação como lida"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            disabled={isUpdating || isDeleting}
            aria-label="Eliminar notificação"
            title="Eliminar notificação"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
            ) : (
              <X className="h-4 w-4 text-rose-600" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const NotificationPage = () => {
  const { user } = useCurrentUser();

  const personId = user?.id ?? 0;

  const {
    activeFilter,
    notifications,
    totalCount,
    unreadCount,
    isLoading,
    isError,
    setActiveFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({ personId });

  const updatingNotificationId = markAsRead.variables ?? null;
  const deletingNotificationId = deleteNotification.variables ?? null;

  const emptyMessage = useMemo(() => {
    if (!user) {
      return "Não existe nenhum utilizador autenticado.";
    }

    if (activeFilter === "unread") {
      return "Não existem notificações por ler.";
    }

    return "Não existem notificações disponíveis.";
  }, [activeFilter, user]);

  const isPageLoading = Boolean(user) && isLoading;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notificações</h1>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {formatUnreadCountLabel(unreadCount)}
            </p>
            <p className="text-sm text-slate-500">
              Consulte as atualizações operacionais mais recentes.
            </p>
          </div>

          {unreadCount > 0 && user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void markAllAsRead();
              }}
              disabled={markAsRead.isPending || deleteNotification.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            disabled={!user}
          >
            <Bell className="mr-2 h-4 w-4" />
            Todas ({totalCount})
          </Button>

          <Button
            variant={activeFilter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("unread")}
            disabled={!user}
          >
            <BellOff className="mr-2 h-4 w-4" />
            Por ler ({unreadCount})
          </Button>
        </div>
      </section>

      {isPageLoading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />A carregar
            notificações...
          </div>
        </Card>
      ) : null}

      {isError ? (
        <Card className="border-rose-200 bg-rose-50 p-8">
          <div className="flex items-center gap-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4" />
            Não foi possível carregar as notificações.
          </div>
        </Card>
      ) : null}

      {!isPageLoading && !isError ? (
        <section className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <p className="text-sm text-slate-600">{emptyMessage}</p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={(notificationId) => {
                  markAsRead.mutate(notificationId);
                }}
                onDelete={(notificationId) => {
                  deleteNotification.mutate(notificationId);
                }}
                isUpdating={
                  updatingNotificationId === notification.id &&
                  markAsRead.isPending
                }
                isDeleting={
                  deletingNotificationId === notification.id &&
                  deleteNotification.isPending
                }
              />
            ))
          )}
        </section>
      ) : null}
    </div>
  );
};

export default NotificationPage;
