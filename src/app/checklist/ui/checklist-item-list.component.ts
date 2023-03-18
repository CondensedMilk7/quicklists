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
import { IonicModule, IonList } from '@ionic/angular';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  selector: 'app-checklist-item-list',
  template: `
    <ion-card *ngIf="checklistItems.length === 0">
      <ion-card-header>Add an item</ion-card-header>
      <ion-card-content>
        <p>Press the add button to create items for your quicklist.</p>
      </ion-card-content>
    </ion-card>
    <ion-list lines="none">
      <ion-item-sliding *ngFor="let checklistItem of checklistItems">
        <ion-item (click)="toggle.emit(checklistItem.id)">
          <ion-label>
            {{ checklistItem.title }}
          </ion-label>
          <ion-checkbox
            slot="end"
            [checked]="checklistItem.checked"
          ></ion-checkbox>
        </ion-item>

        <ion-item-options>
          <ion-item-option
            color="light"
            (click)="edit.emit(checklistItem); closeItems()"
          >
            <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
          </ion-item-option>
          <ion-item-option
            color="danger"
            (click)="delete.emit(checklistItem.id); closeItems()"
          >
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistItemListComponent {
  @Input() checklistItems!: ChecklistItem[];
  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<ChecklistItem>();
  @Output() delete = new EventEmitter<string>();

  @ViewChild(IonList) itemsList!: IonList;

  trackByFn(index: number, item: ChecklistItem) {
    return item.id;
  }

  async closeItems() {
    await this.itemsList.closeSlidingItems();
  }
}

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ChecklistItemListComponent],
  exports: [ChecklistItemListComponent],
})
export class ChecklistItemListComponentModule {}
