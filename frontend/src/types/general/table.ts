export type QueryingOptions = {
  sortingOptions?: { attribute: string; desc: boolean }[];
  filteringOptions?: { attribute: string; value: unknown }[];
} & (
  | {
      pageIndex?: number;
      pageSize?: number;
    }
  | {
      pageIndex: number;
      pageSize: number;
    }
);
