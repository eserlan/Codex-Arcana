export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

class NotificationStore {
  list = $state<Notification[]>([]);

  add(notification: Omit<Notification, "id">) {
    const id = crypto.randomUUID();
    const newNotification = { ...notification, id };
    this.list.push(newNotification);

    if (notification.duration !== 0) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration || 3000);
    }
  }

  remove(id: string) {
    this.list = this.list.filter((n) => n.id !== id);
  }

  success(message: string, duration?: number) {
    this.add({ type: "success", message, duration });
  }

  error(message: string, duration?: number) {
    this.add({ type: "error", message, duration });
  }

  warning(message: string, duration?: number) {
    this.add({ type: "warning", message, duration });
  }

  info(message: string, duration?: number) {
    this.add({ type: "info", message, duration });
  }
}

export const notifications = new NotificationStore();
