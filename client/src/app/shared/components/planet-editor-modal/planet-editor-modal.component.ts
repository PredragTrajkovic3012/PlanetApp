import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanetStore } from '@pages/planets/planets.store';
import { Planet } from '@shared/models/planet.model';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';
import { MessageService } from '@shared/services/message.service';
import { PlanetService } from '@shared/services/planet.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-planet-editor-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './planet-editor-modal.component.html',
  styleUrl: './planet-editor-modal.component.scss',
})
export class PlanetEditorModalComponent implements OnInit, OnDestroy {
  private _subscriptions = new Subscription();
  fb = inject(FormBuilder);
  planetService = inject(PlanetService);
  planetStore = inject(PlanetStore);
  confirmDialogService = inject(ConfirmDialogService);
  messageService = inject(MessageService);
  planetForm = this.fb.group({
    planetName: ['', [Validators.required, Validators.minLength(3)]],
    planetColor: ['', Validators.required],
    planetRadiusKM: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    distFromSun: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    distFromEarth: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    description: ['', Validators.required],
    image: [null as File | null],
  });
  imageError: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isEditMode: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { planet: Planet },
    public readonly matDialogRef: MatDialogRef<PlanetEditorModalComponent>,
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.planet;

    if (this.isEditMode) {
      this.patchFormForEdit();
    }
  }

  private patchFormForEdit(): void {
    const planet = this.data!.planet;

    this.planetForm.patchValue({
      planetName: planet.planetName,
      planetColor: planet.planetColor,
      planetRadiusKM: planet.planetRadiusKM + '',
      distFromSun: +planet.distInMillionsKM.fromSun + '',
      distFromEarth: +planet.distInMillionsKM.fromEarth + '',
      description: planet.description,
    });

    if (planet.imageUrl) {
      this.previewUrl = planet.imageUrl;
    }
  }
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.imageError = null;
    this.previewUrl = null;

    const validTypes = ['image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      this.imageError = 'Only PNG or JPG images are allowed.';
      this.planetForm.get('image')?.setValue(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.imageError = 'Image must be smaller than 10MB.';
      this.planetForm.get('image')?.setValue(null);
      return;
    }

    this.planetForm.get('image')?.setValue(file);
    this.planetForm.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onSubmit() {
    if (this.planetForm.invalid) {
      this.planetForm.markAllAsTouched();
      return;
    }

    const formData = this.createFormData();
    const action = this.isEditMode ? 'Update' : 'Create';
    const confirmText = action;

    this._subscriptions.add(
      this.openConfirmDialog(action, confirmText).subscribe(confirmed => {
        if (!confirmed) return;

        if (this.isEditMode) {
          this.planetStore.updatePlanet({ id: this.data.planet.id, formData });
        } else {
          this.planetStore.addPlanet(formData);
        }

        this.matDialogRef.close({});
      }),
    );
  }

  private createFormData(): FormData {
    const formData = new FormData();
    const { planetName, planetColor, planetRadiusKM, distFromSun, distFromEarth, description, image } =
      this.planetForm.value;

    formData.append('planetName', planetName!);
    formData.append('planetColor', planetColor!);
    formData.append('planetRadiusKM', planetRadiusKM!);
    formData.append('distInMillionsKM', JSON.stringify({ fromSun: distFromSun, fromEarth: distFromEarth }));
    formData.append('description', description!);

    if (image) {
      formData.append('file', image);
    } else if (this.isEditMode && this.data.planet.imageUrl) {
      formData.append('imageUrl', this.data.planet.imageUrl);
    }
    return formData;
  }

  private openConfirmDialog(action: string, confirmText: string) {
    return this.confirmDialogService
      .openConfirmDialog({
        title: `${action} Planet`,
        message: `Are you sure you want to ${action.toLowerCase()} "${this.planetForm.value.planetName}"?`,
        imageUrl: null,
        confirmText,
        cancelText: 'Cancel',
      })
      .afterClosed();
  }
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
