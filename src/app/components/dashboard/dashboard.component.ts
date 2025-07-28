import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { SignalRService, Notification } from '../../services/signalr.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  products: Product[] = [];
  notifications: Notification[] = [];
  signalRConnectionState = 'Disconnected';
  productsCount = 0;
  loading = false;
  error: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private signalRService: SignalRService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.subscribeToServices();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private subscribeToServices(): void {
    // Subscribe to current user
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    // Subscribe to SignalR connection state
    this.subscriptions.push(
      this.signalRService.connectionState$.subscribe(state => {
        this.signalRConnectionState = state;
      })
    );

    // Subscribe to notifications
    this.subscriptions.push(
      this.signalRService.notifications$.subscribe(notifications => {
        this.notifications = notifications.slice(0, 5); // Show only latest 5
      })
    );
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    // Load products
    this.subscriptions.push(
      this.productService.getProducts().subscribe({
        next: (products) => {
          this.products = products.slice(0, 5); // Show only latest 5
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.error = 'Failed to load products';
          this.loading = false;
        }
      })
    );

    // Load products count
    this.subscriptions.push(
      this.productService.getProductsCount().subscribe({
        next: (count) => {
          this.productsCount = count;
        },
        error: (error) => {
          console.error('Error loading products count:', error);
        }
      })
    );
  }

  logout(): void {
    this.authService.logout();
  }

  testSignalR(): void {
    // This would typically call a backend endpoint that triggers a SignalR message
    console.log('Testing SignalR connection...');
    // You could make an HTTP call to your notifications controller test endpoint here
  }

  refreshData(): void {
    this.loadData();
  }

  getConnectionStateClass(): string {
    switch (this.signalRConnectionState) {
      case 'Connected':
        return 'text-success';
      case 'Connecting':
      case 'Reconnecting':
        return 'text-warning';
      case 'Disconnected':
      case 'Error':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }

  getNotificationTypeClass(type: string): string {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      case 'error':
        return 'alert-danger';
      case 'info':
      default:
        return 'alert-info';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTimestamp(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString();
  }
}