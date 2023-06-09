export class PageDto<T, S> {
  data: T[];

  nextCursor: S;

  constructor(data: T[], nextCursor: S) {
    this.data = data;
    this.nextCursor = nextCursor;
  }
}

export type TimelinePageDto<T> = PageDto<T, Date>;