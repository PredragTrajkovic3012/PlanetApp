import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PlanetStore } from '@pages/planets/planets.store';
import { DisplayModeService } from '@shared/services/display-mode.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { PlanetEditorModalComponent } from '../planet-editor-modal/planet-editor-modal.component';
import { Router, RouterLink } from '@angular/router';
import { PlanetService } from '@shared/services/planet.service';
import { MessageService } from '@shared/services/message.service';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [MatIconModule, AsyncPipe, CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  displayModeService = inject(DisplayModeService);
  router = inject(Router);
  planetStore = inject(PlanetStore);
  planetService = inject(PlanetService);
  messageService = inject(MessageService);
  confirmDialogService = inject(ConfirmDialogService);
  dialog = inject(MatDialog);
  searchControl = new FormControl('');
  private _subscriptions = new Subscription();

  ngOnInit() {
    this.initSearch();
  }
  //Note: I am aware that we should probably also use API when searching
  private initSearch(): void {
    this._subscriptions.add(
      this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
        this.planetStore.setSearchTerm(value ?? '');
      }),
    );
  }

  toggle() {
    this.displayModeService.toggleView();
  }
  openPlanetDialog() {
    this.dialog.open(PlanetEditorModalComponent, {
      data: this.planetStore.overviewedPlanet() ? { planet: this.planetStore.overviewedPlanet() } : {},
    });
  }

  deletePlanet() {
    const planet = this.planetStore.overviewedPlanet();
    if (!planet?.id) return;
    this._subscriptions.add(
      this.confirmDialogService
        .openConfirmDialog({
          title: 'Delete Planet',
          message: `Are you sure you want to delete this Planet? `,
          imageUrl: null,
          confirmText: 'Delete',
          cancelText: 'Cancel',
        })
        .afterClosed()
        .subscribe(confirmed => {
          if (confirmed) {
            this.planetStore.deletePlanet(planet?.id);
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
