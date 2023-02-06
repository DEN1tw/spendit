import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import {
  ColumnHeader,
  Data,
  Nullable,
  PromisedRawData,
  PromisedPaginatedRawData,
  RawData,
} from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild('idTpl', { static: true }) idTpl!: TemplateRef<unknown>;
  @ViewChild('firstNameTpl', { static: true }) firstNameTpl!: TemplateRef<unknown>;
  @ViewChild('lastNameTpl', { static: true }) lastNameTpl!: TemplateRef<unknown>;
  columnHeaders: Nullable<ColumnHeader[]> = null;
  data: Nullable<Data> = null;
  selectable: boolean = false;
  selectedRows: Nullable<RawData[]> = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.setColumnHeaders();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  private setColumnHeaders(): void {
    this.columnHeaders = [
      { field: 'id', headerName: 'ID', headerHtml: this.idTpl },
      { field: 'firstName', headerHtml: this.firstNameTpl },
      { field: 'lastName', headerName: 'LAST NAME', headerHtml: this.lastNameTpl },
    ];
  }

  setRawData(): void {
    const data: RawData[] = [
      { id: '1', firstName: 'Denis', lastName: 'Romanenko' },
      { id: '2', firstName: 'Brad', lastName: 'Mathews' },
      { id: '3', firstName: 'Fodor', lastName: 'Bond' },
      { id: '4', firstName: 'Mike', lastName: 'Tyson' },
    ];
    this.data = data;
  }

  setPromisedRawData(): void {
    const promise: PromisedRawData = new Promise((resolve) => {
      const data = [
        { id: '10', firstName: 'James', lastName: 'Vu' },
        { id: '20', firstName: 'Stephen', lastName: 'Gaudet' },
        { id: '30', firstName: 'Hugh', lastName: 'Lorie' },
      ];
      resolve(data);
    });
    this.data = promise;
  }

  setPromisedPaginatedRawData(): void {
    const promise: PromisedPaginatedRawData = new Promise((resolve) => {
      const data = {
        data: [
          { id: '100', firstName: 'Ivan', lastName: 'Ivanov' },
          { id: '200', firstName: 'Clark', lastName: 'Kent' },
          { id: '300', firstName: 'Dan', lastName: 'Smith' },
        ],
        total: 101,
        skip: 1,
        take: 20,
      };
      resolve(data);
    });
    this.data = promise;
  }

  toggleSelectable(): void {
    this.selectable = !this.selectable;
  }
}
