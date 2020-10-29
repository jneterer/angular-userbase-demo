import { Component } from '@angular/core';
import { UserbaseService } from './userbase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  initialized: boolean = null;

  constructor(private userbaseService: UserbaseService) {
    this.userbaseService.$initialized.subscribe((initialized: boolean) => {
      this.initialized = initialized;
    });
  }
}
