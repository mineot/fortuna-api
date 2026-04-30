export type CrudTable = {
  title: string;
  pagination: {};
  actions: {}[];
  headers: {
    key: string;
    header: string;
  }[];
  rows: {
    key: string;
    value: string;
  }[];
};
