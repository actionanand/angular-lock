import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { LockScreenService } from './lock-screen/lock-screen.service';
import { LoggerService } from './logger/logger.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LockScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly lockService = inject(LockScreenService);
  private readonly logger = inject(LoggerService);
  
  protected readonly showLockScreen = this.lockService.showLockScreen;
  protected title = 'Angular 20.3.0 Application with AI Instructions';

  ngOnInit(): void {
    // Logger is automatically initialized
    // It checks localStorage['enableLog'] === 'ON' to enable logs
    this.logger.log('Application initialized');
    this.logger.info('Logging status:', this.logger.isLoggingEnabled() ? 'ENABLED' : 'DISABLED');
  }
}
