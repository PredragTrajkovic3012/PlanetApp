import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PlanetStore } from '@pages/planets/planets.store';
import { DisplayModeService } from '@shared/services/display-mode.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PlanetEditorModalComponent } from '../../../components/planet-editor-modal/planet-editor-modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [MatIconModule, AsyncPipe, CommonModule, ReactiveFormsModule, RouterLink],
})
export class HeaderComponent implements OnInit {
  displayModeService = inject(DisplayModeService);
  planetStore = inject(PlanetStore);
  dialog = inject(MatDialog);

  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.planetStore.setSearchTerm(value ?? '');
    });
  }
  toggle() {
    this.displayModeService.toggleView();
  }
  openPlanetDialog() {
    this.dialog.open(PlanetEditorModalComponent);
  }
}
