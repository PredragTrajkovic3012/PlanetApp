import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}

  snackBar = inject(MatSnackBar);

  success(message: string, duration: number = 5000) {
    this.snackBar.open(message, '✖', {
      duration,
      panelClass: 'snackbar-success',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  error(message: string, duration: number = 5000) {
    this.snackBar.open(message, '✖', {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
