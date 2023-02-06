import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

const DEFAULT_TOTAL_PAGES = 0;
const DEFAULT_ITEMS_ON_PAGE = 10;
const DEFAULT_CURRENT_PAGE_NUMBER = 1;

@Component({
  standalone: true,
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = DEFAULT_CURRENT_PAGE_NUMBER;
  @Input() total: number = DEFAULT_TOTAL_PAGES;
  @Input() take: number = DEFAULT_ITEMS_ON_PAGE;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];

  ngOnInit() {
    const pagesCount = Math.ceil(this.total / this.take);
    this.pages = this.range(1, pagesCount);
  }

  range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start);
  }
}
