import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Planet } from '@shared/models/planet.model';
@Component({
  selector: 'app-planet-editor-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './planet-editor-modal.component.html',
  styleUrl: './planet-editor-modal.component.scss',
})
export class PlanetEditorModalComponent implements OnInit {
  fb = inject(FormBuilder);
  planetForm = this.fb.group({
    planetName: ['', [Validators.required, Validators.minLength(3)]],
    planetColor: ['', Validators.required],
    planetRadiusKM: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    distFromSun: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    distFromEarth: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    description: ['', Validators.required],
    image: [null as File | null, Validators.required],
  });
  imageError: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { planet: Planet },
    public readonly matDialogRef: MatDialogRef<PlanetEditorModalComponent>,
  ) {}

  ngOnInit(): void {
    if (this.data?.planet) {
      // this.planetForm.patchValue(this.data.planet);
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

  onSubmit() {}
}
