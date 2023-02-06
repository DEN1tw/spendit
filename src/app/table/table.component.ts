import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination/pagination.component';
import {ColumnHeader, Nullable, Paginated, RawData, SourceType} from '../types';

@Component({
  standalone: true,
  selector: 'app-table',
  templateUrl: './table.component.html',
  imports: [CommonModule, FormsModule, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<TData, RData extends RawData> {
  @Input() columnHeaders: Nullable<ColumnHeader[]> = null;
  @Input() selectable: boolean = false;
  @Input() selectedRows!: Nullable<RData[]>;
  @Output() selectedRowsChange = new EventEmitter<Nullable<RData[]>>();
  @Input()
  set data(data: TData) {
    this._handleDataSetter(data);
  }
  get allSelected(): boolean {
    return [...this.dataMap.values()].every((value) => value);
  }
  sourceType: SourceType = 'Raw';
  readonly dataMap: Map<RData, boolean> = new Map();
  currentPage!: number;
  take!: number;
  total!: number;

  constructor(private cdr: ChangeDetectorRef) {}

  changePage(page: number): void {
    this.currentPage = page;
  }

  toggleSelection(key: any, eventTarget: Nullable<EventTarget>): void {
    const isSelected = !!(<HTMLInputElement>eventTarget)?.checked;
    this.dataMap.set(key, isSelected);
    this._setSelectedRows();
  }

  toggleAllSelection(eventTarget: Nullable<EventTarget>): void {
    const isSelected = !!(<HTMLInputElement>eventTarget)?.checked;
    this.dataMap.forEach((_, key) => {
      this.dataMap.set(key, isSelected);
    });
    this._setSelectedRows();
  }

  private _setSelectedRows(): void {
    const res: RData[] = [];
    this.dataMap.forEach((value, key) => {
      if (value) {
        res.push(key);
      }
    });
    this.selectedRows = res.length ? res : null;
    this.selectedRowsChange.emit(this.selectedRows);
  }

  private _handleDataSetter(data: TData): void {
    let source: RData[] = [];
    this.dataMap.clear();
    if (data instanceof Promise) {
      data.then((resolvedData) => {
        if (this._isPromisedPaginated(resolvedData)) {
          source = resolvedData.data;
          this.sourceType = 'PromisedPaginated';
          this.currentPage = resolvedData.skip;
          this.take = resolvedData.take;
          this.total = resolvedData.total;
        } else {
          source = resolvedData;
          this.sourceType = 'Promised';
        }
        source.forEach((obj) => {
          this.dataMap.set(obj, false);
        });
        this._setSelectedRows();
        this.cdr.detectChanges();
      });
    } else if (this._isRaw(data)) {
      source = data;
      this.sourceType = 'Raw';
      source.forEach((obj) => {
        this.dataMap.set(obj, false);
      });
      this._setSelectedRows();
    }
  }

  private _isPromisedPaginated(data: RData[] | Paginated<RData>): data is Paginated<RData> {
    return data.hasOwnProperty('data');
  }

  private _isRaw(data: unknown): data is RData[] {
    return Array.isArray(data);
  }
}
