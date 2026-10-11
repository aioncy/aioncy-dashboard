import { BellOff } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import NotificationItem from "../../components/NotificationItem";
import { COLLABORATORS, handleShare } from "../../lib/dashboard";
import {
  markAllNotificationsRead,
  markNotificationRead,
  respondToTakeover,
  useNotifications,
  type AppNotification,
} from "../../lib/notifications";
import styles from "./NotificationsPage.module.scss";

export function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, unreadCount } = useNotifications();

  const openTarget = (notification: AppNotification) => {
    const { target } = notification;
    if (!target) return;
    switch (target.kind) {
      case "conversation":
        navigate({
          to: "/conversations",
          search: { conversation: target.conversationId, from: "notifications" },
        });
        break;
      case "ticket":
        navigate({ to: "/tickets" });
        break;
      case "knowledge-base":
        navigate({ to: "/wingman-ai/knowledge-base" });
        break;
      case "billing":
        navigate({ to: "/settings" });
        break;
    }
  };

  const handleOpen = (notification: AppNotification) => {
    markNotificationRead(notification.id);
    openTarget(notification);
  };

  const handleAccept = (notification: AppNotification) => {
    respondToTakeover(notification.id, "accepted");
    openTarget(notification);
  };

  const handleDecline = (notification: AppNotification) => {
    respondToTakeover(notification.id, "declined");
  };

  return (
    <div>
      <PageHeader title="Notification" collaborators={COLLABORATORS} onShare={handleShare} />

      <div className={styles.page}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>All notification</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={unreadCount === 0}
            onClick={markAllNotificationsRead}
          >
            Mark all as read
          </Button>
        </div>

        {notifications.length > 0 ? (
          <div className={styles.list}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onOpen={handleOpen}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <BellOff size={20} aria-hidden="true" />
            </span>
            <p className={styles.emptyTitle}>You're all caught up</p>
            <p className={styles.emptyText}>
              New notifications show up here. Choose which ones you get in{" "}
              <button type="button" className={styles.emptyLink} onClick={() => navigate({ to: "/account", search: { tab: "notifications" } })}>
                Account settings
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
