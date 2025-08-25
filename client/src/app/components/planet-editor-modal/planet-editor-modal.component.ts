import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanetStore } from '@pages/planets/planets.store';
import { Planet } from '@shared/models/planet.model';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';
import { MessageService } from '@shared/services/message.service';
import { PlanetService } from '@shared/services/planet.service';
@Component({
  selector: 'app-planet-editor-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './planet-editor-modal.component.html',
  styleUrl: './planet-editor-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetEditorModalComponent implements OnInit {
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

    const formData = new FormData();
    const distance = {
      fromSun: this.planetForm.value.distFromSun,
      fromEarth: this.planetForm.value.distFromEarth,
    };

    formData.append('planetName', this.planetForm.value.planetName!);
    formData.append('planetColor', this.planetForm.value.planetColor!);
    formData.append('planetRadiusKM', this.planetForm.value.planetRadiusKM!);
    formData.append('distInMillionsKM', JSON.stringify(distance));
    formData.append('description', this.planetForm.value.description!);
    if (this.planetForm.value.image) {
      formData.append('file', this.planetForm.value.image);
    }

    const action = this.isEditMode ? 'Update' : 'Create';
    const confirmText = this.isEditMode ? 'Update' : 'Create';

    this.confirmDialogService
      .openConfirmDialog({
        title: `${action} Planet`,
        message: `Are you sure you want to ${action.toLowerCase()} "${this.planetForm.value.planetName}"?`,
        imageUrl: null,
        confirmText,
        cancelText: 'Cancel',
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;

        if (this.isEditMode) {
          this.planetStore.updatePlanet({ id: this.data.planet.id, formData });
          this.matDialogRef.close({});
        } else {
          this.planetStore.addPlanet(formData);
          this.matDialogRef.close({});
        }
      });
  }
}
