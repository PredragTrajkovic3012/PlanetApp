import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { DisplayModeService } from '@shared/services/display-mode.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [MatIconModule, AsyncPipe],
})
export class HeaderComponent {
    displayModeService = inject(DisplayModeService);
  
}
