import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  shareReplay,
  take,
  tap,
} from 'rxjs';
import { ChecklistItemService } from 'src/app/checklist/data-access/checklist-item.service';
import { AddChecklist, Checklist } from '../interfaces/checklist';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  private checklists$ = new BehaviorSubject<Checklist[]>([]);

  private sharedChecklists$: Observable<Checklist[]> = this.checklists$.pipe(
    tap((checklists) => {
      this.storageService.saveChecklists(checklists);
    }),
    shareReplay(1)
  );

  constructor(
    private storageService: StorageService,
    private checklistItemService: ChecklistItemService
  ) {}

  load() {
    this.storageService.loadChecklists$
      .pipe(take(1))
      .subscribe((checklists) => {
        this.checklists$.next(checklists);
      });
  }

  getChecklists() {
    return this.sharedChecklists$;
  }

  add(checklist: Pick<Checklist, 'title'>) {
    const newChecklist = {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
    this.checklists$.next([...this.checklists$.value, newChecklist]);
  }

  getChecklistById(id: string) {
    return this.checklists$.pipe(
      filter((checklists) => checklists.length > 0), // Prevents emit if no checklists
      map((checklists) => checklists.find((checklist) => checklist.id === id))
    );
  }

  private generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    const matchSlugs = this.checklists$.value.find(
      (checklist) => checklist.id === slug
    );

    if (matchSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }

  remove(id: string) {
    const modifiedChecklist = this.checklists$.value.filter(
      (checklist) => checklist.id !== id
    );

    this.checklistItemService.removeAllItemsForChecklist(id);
    this.checklists$.next(modifiedChecklist);
  }

  update(id: string, updatedChecklist: AddChecklist) {
    const modifiedChecklists = this.checklists$.value.map((checklist) =>
      checklist.id === id
        ? { ...checklist, title: updatedChecklist.title }
        : checklist
    );

    this.checklists$.next(modifiedChecklists);
  }
}
