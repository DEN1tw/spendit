import { TemplateRef } from '@angular/core';

export interface Paginated<T> {
  data: Array<T>;
  total: number;
  skip: number;
  take: number;
}

export type Nullable<T> = T | null;

export type RawData = {
  id: string;
  firstName: string;
  lastName: string;
};

export type PromisedRawData = Promise<RawData[]>;

export type PromisedPaginatedRawData = Promise<Paginated<RawData>>;

export type Data = RawData[] | PromisedRawData | PromisedPaginatedRawData;

export type ColumnHeader = {
  field: keyof RawData;
  headerName?: string;
  headerHtml?: TemplateRef<unknown>;
};

export type SourceType = 'Promised' | 'PromisedPaginated' | 'Raw';
