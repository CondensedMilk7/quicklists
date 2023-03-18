import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  NgModule,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-form-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ title }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="formGroup" (ngSubmit)="handleSave()">
        <ion-item *ngFor="let control of formGroup.controls | keyvalue">
          <ion-label position="stacked">{{ control.key }}</ion-label>
          <ion-input type="text" [formControlName]="control.key"></ion-input>
        </ion-item>
        <ion-button
          expand="full"
          type="submit"
          color="dark"
          [disabled]="formGroup.invalid"
        >
          <ion-icon slot="start" style="save-outline"></ion-icon> Save
        </ion-button>
      </form>
    </ion-content>
  `,
  styles: [
    `
      :host {
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModalComponent {
  @Input() title!: string;
  @Input() formGroup!: FormGroup;

  @Output() save = new EventEmitter<boolean>();

  constructor(private modalCtrl: ModalController) {}

  handleSave() {
    this.save.emit(true);
    this.dismiss();
  }

  dismiss() {
    this.formGroup.reset();
    this.modalCtrl.dismiss();
  }
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  declarations: [FormModalComponent],
  exports: [FormModalComponent],
})
export class FormModalComponentModule {}
