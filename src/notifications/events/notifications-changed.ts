export class NotificationsChangedEvent {
  static eventName = 'notifications-changed.event';

  userId: number;
  // unreadNotificationsCount: number;

  constructor(params: { userId: number }) {
    this.userId = params.userId;
    // this.unreadNotificationsCount = params.unreadNotificationsCount;
  }
}