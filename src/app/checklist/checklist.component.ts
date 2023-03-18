import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonContent, IonicModule, IonRouterOutlet } from '@ionic/angular';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { Checklist } from '../shared/interfaces/checklist';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import { FormModalComponentModule } from '../shared/ui/form-modal.component';
import { HeaderComponentModule } from '../shared/ui/header.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistItemListComponentModule } from './ui/checklist-item-list.component';

@Component({
  selector: 'app-checklist',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <app-header
        [title]="vm.checklist.title"
        (openModal)="this.formModalIsOpen$.next($event)"
      >
        <ion-back-button header-left defaultHref="/"></ion-back-button>
        <ion-button (click)="resetChecklistItems(vm.checklist.id)">
          <ion-icon name="refresh" slot="icon-only"></ion-icon>
        </ion-button>
      </app-header>
      <ion-content>
        <app-checklist-item-list
          [checklistItems]="vm.items"
          (toggle)="toggleChecklistItem($event)"
          (edit)="openEditModal($event)"
          (delete)="deleteCecklistItem($event)"
        ></app-checklist-item-list>
        <ion-modal
          [isOpen]="vm.formModalIsOpen"
          [canDismiss]="true"
          (ionModalDidDismiss)="
            checklistItemIdBeingEdited$.next(null); formModalIsOpen$.next(false)
          "
          [presentingElement]="ionRouterOutlet.nativeEl"
        >
          <ng-template>
            <app-form-modal
              [title]="
                vm.checklistItemIdBeingEdited ? 'Edit item' : 'Create item'
              "
              [formGroup]="checklistItemForm"
              (save)="
                vm.checklistItemIdBeingEdited
                  ? editChecklistItem(vm.checklistItemIdBeingEdited)
                  : addChecklistItem(vm.checklist.id)
              "
            ></app-form-modal>
          </ng-template>
        </ion-modal>
      </ion-content>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent {
  checklistAndItems$ = this.route.paramMap.pipe(
    switchMap((params) =>
      combineLatest([
        this.checklistService
          .getChecklistById(params.get('id') as string)
          .pipe(filter((checklist): checklist is Checklist => !!checklist)),
        this.checklistItemService
          .getItemsByChecklistId(params.get('id') as string)
          // Hack, needs a better solution
          .pipe(
            tap(() => setTimeout(() => this.ionContent.scrollToBottom(200), 0))
          ),
      ])
    )
  );

  formModalIsOpen$ = new BehaviorSubject<boolean>(false);
  checklistItemIdBeingEdited$ = new BehaviorSubject<string | null>(null);

  vm$ = combineLatest([
    this.checklistAndItems$,
    this.formModalIsOpen$,
    this.checklistItemIdBeingEdited$,
  ]).pipe(
    map(
      ([[checklist, items], formModalIsOpen, checklistItemIdBeingEdited]) => ({
        checklist,
        items,
        formModalIsOpen,
        checklistItemIdBeingEdited,
      })
    )
  );

  checklistItemForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  @ViewChild(IonContent) ionContent!: IonContent;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService,
    public ionRouterOutlet: IonRouterOutlet
  ) {}

  addChecklistItem(checklistId: string) {
    this.checklistItemService.add(
      this.checklistItemForm.getRawValue(),
      checklistId
    );
  }

  toggleChecklistItem(itemId: string) {
    this.checklistItemService.toggle(itemId);
  }

  resetChecklistItems(checklistId: string) {
    this.checklistItemService.reset(checklistId);
  }

  deleteCecklistItem(checklistId: string) {
    this.checklistItemService.delete(checklistId);
  }

  editChecklistItem(itemId: string) {
    this.checklistItemService.update(
      itemId,
      this.checklistItemForm.getRawValue()
    );
  }

  openEditModal(item: ChecklistItem) {
    this.checklistItemForm.patchValue({
      title: item.title,
    });
    this.checklistItemIdBeingEdited$.next(item.id);
    this.formModalIsOpen$.next(true);
  }
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormModalComponentModule,
    ChecklistItemListComponentModule,
    HeaderComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChecklistComponent,
      },
    ]),
  ],
  declarations: [ChecklistComponent],
})
export class ChecklistComponentModule {}
