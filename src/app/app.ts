import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { LockScreenService } from './lock-screen/lock-screen.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LockScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly lockService = inject(LockScreenService);
  
  protected readonly showLockScreen = this.lockService.showLockScreen;
  protected title = 'Angular 20.3.0 Application with AI Instructions';
}
