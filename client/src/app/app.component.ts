import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { DisplayModeService } from '@shared/services/display-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  displayModeService = inject(DisplayModeService);

  ngOnInit(): void {
    if (localStorage.getItem('displayMode')) {
      this.displayModeService.isTable$.next(localStorage.getItem('displayMode') === 'table');
    }
  }
}
