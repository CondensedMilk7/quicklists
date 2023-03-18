import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, IonList } from '@ionic/angular';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  selector: 'app-checklist-list',
  template: `
    <ion-card *ngIf="checklists.length === 0">
      <ion-card-header> Welcome! </ion-card-header>
      <ion-card-content>
        <p>Press the add button to create a quicklist.</p>
      </ion-card-content>
    </ion-card>
    <ion-list lines="none">
      <ion-item-sliding
        *ngFor="let checklist of checklists; trackBy: trackByFn"
      >
        <ion-item
          data-test="checklist-item"
          button
          routerLink="/checklist/{{ checklist.id }}"
          routerDirection="forward"
        >
          <ion-label>{{ checklist.title }}</ion-label>
        </ion-item>

        <ion-item-options>
          <ion-item-option
            color="light"
            (click)="edit.emit(checklist); closeItems()"
          >
            <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
          </ion-item-option>
          <ion-item-option
            color="danger"
            (click)="delete.emit(checklist.id); closeItems()"
          >
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistListComponent {
  @Input() checklists!: Checklist[];
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Checklist>();

  @ViewChild(IonList) checklistList!: IonList;

  trackByFn(index: number, checklist: Checklist) {
    return checklist.id;
  }

  async closeItems() {
    await this.checklistList.closeSlidingItems();
  }
}

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule],
  declarations: [ChecklistListComponent],
  exports: [ChecklistListComponent],
})
export class ChecklistListComponentModule {}
