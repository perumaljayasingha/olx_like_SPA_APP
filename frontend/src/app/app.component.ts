import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ErrorBannerComponent } from './shared/ui/error-banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ErrorBannerComponent, UpperCasePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly auth = inject(AuthService);
}
