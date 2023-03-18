import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Checklist } from '../interfaces/checklist';

@Component({
  selector: 'app-header',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ng-content select="[header-left]"></ng-content>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ng-content> </ng-content>
          <ion-button (click)="openModal.emit(true)">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title!: string;
  @Output() openModal = new EventEmitter<boolean>();
}

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderComponentModule {}
