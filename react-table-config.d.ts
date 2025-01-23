// react-table-config.d.ts
import 'react-table';

declare module 'react-table' {
  export interface ColumnInstance<D extends object = {}> extends UseSortByColumnProps<D> {}
}
