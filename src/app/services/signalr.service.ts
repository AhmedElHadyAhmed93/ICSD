import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Notification {
  title: string;
  message: string;
  type: string;
  timestamp: Date;
  isPersonal?: boolean;
}

export interface SystemNotification {
  title: string;
  message: string;
  type: string;
  priority: string;
  timestamp: Date;
  requiresAcknowledgment: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private readonly HUB_URL = environment.signalRUrl || 'https://localhost:7001/hubs/notifications';
  private hubConnection: HubConnection | null = null;
  private connectionStateSubject = new BehaviorSubject<string>('Disconnected');
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private systemNotificationsSubject = new BehaviorSubject<SystemNotification[]>([]);

  public connectionState$ = this.connectionStateSubject.asObservable();
  public notifications$ = this.notificationsSubject.asObservable();
  public systemNotifications$ = this.systemNotificationsSubject.asObservable();

  private notifications: Notification[] = [];
  private systemNotifications: SystemNotification[] = [];

  constructor(private authService: AuthService) {
    // Auto-connect when user is authenticated
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.startConnection();
      } else {
        this.stopConnection();
      }
    });
  }

  async startConnection(): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      return;
    }

    const token = this.authService.tokenValue;
    if (!token) {
      console.warn('No authentication token available for SignalR connection');
      return;
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.HUB_URL, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.setupEventHandlers();

    try {
      await this.hubConnection.start();
      this.connectionStateSubject.next('Connected');
      console.log('SignalR connection established');

      // Join user's role groups
      const user = this.authService.currentUserValue;
      if (user?.roles) {
        for (const role of user.roles) {
          await this.joinRoleGroup(role);
        }
      }
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      this.connectionStateSubject.next('Error');
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        this.connectionStateSubject.next('Disconnected');
        console.log('SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    // Handle connection state changes
    this.hubConnection.onreconnecting(() => {
      this.connectionStateSubject.next('Reconnecting');
    });

    this.hubConnection.onreconnected(() => {
      this.connectionStateSubject.next('Connected');
    });

    this.hubConnection.onclose(() => {
      this.connectionStateSubject.next('Disconnected');
    });

    // Handle notifications
    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      this.addNotification(notification);
    });

    this.hubConnection.on('SystemNotification', (notification: SystemNotification) => {
      this.addSystemNotification(notification);
    });

    this.hubConnection.on('RoleNotification', (notification: any) => {
      this.addNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        timestamp: new Date(notification.timestamp)
      });
    });

    this.hubConnection.on('TestMessage', (data: any) => {
      console.log('Test message received:', data);
      this.addNotification({
        title: 'Test Message',
        message: data.message,
        type: 'info',
        timestamp: new Date(data.timestamp)
      });
    });

    this.hubConnection.on('UserConnected', (data: any) => {
      console.log('User connected:', data);
    });

    this.hubConnection.on('UserDisconnected', (data: any) => {
      console.log('User disconnected:', data);
    });

    this.hubConnection.on('ReceiveMessage', (userName: string, message: string, timestamp: string) => {
      this.addNotification({
        title: `Message from ${userName}`,
        message: message,
        type: 'message',
        timestamp: new Date(timestamp)
      });
    });

    this.hubConnection.on('ReceivePrivateMessage', (senderName: string, message: string, timestamp: string) => {
      this.addNotification({
        title: `Private message from ${senderName}`,
        message: message,
        type: 'private',
        timestamp: new Date(timestamp),
        isPersonal: true
      });
    });
  }

  private addNotification(notification: Notification): void {
    this.notifications.unshift(notification);
    // Keep only the last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    this.notificationsSubject.next([...this.notifications]);
  }

  private addSystemNotification(notification: SystemNotification): void {
    this.systemNotifications.unshift(notification);
    // Keep only the last 20 system notifications
    if (this.systemNotifications.length > 20) {
      this.systemNotifications = this.systemNotifications.slice(0, 20);
    }
    this.systemNotificationsSubject.next([...this.systemNotifications]);
  }

  // Hub methods
  async joinGroup(groupName: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke('JoinGroup', groupName);
        console.log(`Joined group: ${groupName}`);
      } catch (error) {
        console.error(`Error joining group ${groupName}:`, error);
      }
    }
  }

  async leaveGroup(groupName: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke('LeaveGroup', groupName);
        console.log(`Left group: ${groupName}`);
      } catch (error) {
        console.error(`Error leaving group ${groupName}:`, error);
      }
    }
  }

  async sendMessageToGroup(groupName: string, message: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke('SendMessageToGroup', groupName, message);
      } catch (error) {
        console.error(`Error sending message to group ${groupName}:`, error);
      }
    }
  }

  async sendMessageToUser(userId: string, message: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke('SendMessageToUser', userId, message);
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
      }
    }
  }

  async joinRoleGroup(role: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke('JoinRoleGroup', role);
        console.log(`Joined role group: ${role}`);
      } catch (error) {
        console.error(`Error joining role group ${role}:`, error);
      }
    }
  }

  async leaveRoleGroup(role: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke('LeaveRoleGroup', role);
        console.log(`Left role group: ${role}`);
      } catch (error) {
        console.error(`Error leaving role group ${role}:`, error);
      }
    }
  }

  // Utility methods
  clearNotifications(): void {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }

  clearSystemNotifications(): void {
    this.systemNotifications = [];
    this.systemNotificationsSubject.next([]);
  }

  get isConnected(): boolean {
    return this.hubConnection?.state === 'Connected';
  }

  get connectionState(): string {
    return this.connectionStateSubject.value;
  }
}