import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '@shared/models/confirm-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog(data: ConfirmDialogData) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data,
      panelClass: 'custom-confirm-dialog',
    });
  }
}
