import { Component, OnInit, signal, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('eCommerce');
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const path = window.location.pathname;

      if (path === '/allorders') {
        this.router.navigate(['/allorders']);
      }
    }
  }
}
