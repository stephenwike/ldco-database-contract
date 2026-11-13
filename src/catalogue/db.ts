// The little of the MongoDB driver the catalogue helpers need. Written as plain interfaces instead of importing the
// driver's types, so an app's own driver (any version from 6.x) can be passed in without a type clash.

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SortSpec = Record<string, 1 | -1>;

export interface CursorLike<T = any> {
  sort(sort: SortSpec): CursorLike<T>;
  skip(n: number): CursorLike<T>;
  limit(n: number): CursorLike<T>;
  hint(hint: SortSpec): CursorLike<T>;
  toArray(): Promise<T[]>;
}

export interface CollectionLike {
  find(filter: object, options?: { projection?: Record<string, number> }): CursorLike;
  countDocuments(filter: object): Promise<number>;
}

/** A connection to the `linedance` database (client.db("linedance")). */
export interface DbLike {
  collection(name: string): CollectionLike;
}
