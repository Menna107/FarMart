import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { RouterLink } from '@angular/router';
import { Order } from '../../core/models/order.interface';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, UpperCasePipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly platformId = inject(PLATFORM_ID);

  ordersList = signal<Order[]>([]);
  expandedOrderId = signal<string | null>(null);

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        localStorage.setItem('userId', decoded.id);
        this.getOrders(decoded.id);
      }
    }
  }

  getOrders(id: string) {
    this.orderService.getUserOrders(id).subscribe({
      next: (res) => {
        this.ordersList.set(res);
      },
    });
  }

  toggleDetails(orderId: string) {
    if (this.expandedOrderId() === orderId) {
      this.expandedOrderId.set(null);
    } else {
      this.expandedOrderId.set(orderId);
    }
  }
}
