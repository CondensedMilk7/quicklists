import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take, tap } from 'rxjs';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import {
  AddChecklistItem,
  ChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';

@Injectable({ providedIn: 'root' })
export class ChecklistItemService {
  checklistItems$ = new BehaviorSubject<ChecklistItem[]>([]);

  constructor(private storageService: StorageService) {}

  load() {
    this.storageService.loadChecklistItems$
      .pipe(take(1))
      .subscribe((checklistItems) => {
        this.checklistItems$.next(checklistItems);
      });
  }

  getItemsByChecklistId(checklistId: string) {
    return this.checklistItems$.pipe(
      map((items) => items.filter((item) => item.checklistId === checklistId)),
      tap(() => {
        this.storageService.saveChecklistItems(this.checklistItems$.value);
      })
    );
  }

  add(item: AddChecklistItem, checklistId: string) {
    const newItem = {
      id: Date.now().toString(),
      checklistId: checklistId,
      checked: false,
      ...item,
    };

    this.checklistItems$.next([...this.checklistItems$.value, newItem]);
  }

  toggle(itemId: string) {
    const newItems = this.checklistItems$.value.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    this.checklistItems$.next(newItems);
  }

  reset(checklistId: string) {
    const newItems = this.checklistItems$.value.map((item) =>
      item.checklistId === checklistId ? { ...item, checked: false } : item
    );

    this.checklistItems$.next(newItems);
  }

  update(id: string, editedItem: AddChecklistItem) {
    const newItems = this.checklistItems$.value.map((item) =>
      item.id === id ? { ...item, title: editedItem.title } : item
    );

    this.checklistItems$.next(newItems);
  }

  delete(id: string) {
    const modifiedItems = this.checklistItems$.value.filter(
      (item) => item.id !== id
    );

    this.checklistItems$.next(modifiedItems);
  }

  removeAllItemsForChecklist(checklistId: string) {
    const modifiedItems = this.checklistItems$.value.filter(
      (item) => item.checklistId !== checklistId
    );

    this.checklistItems$.next(modifiedItems);
  }
}
