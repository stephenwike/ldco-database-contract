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

// ── Editing ──────────────────────────────────────────────────────────────────────────────────────────────────────
// What the editing helpers (catalogue edits, merges) need. Documents come back untyped: these collections hold many
// shapes, and each helper says what it reads.

export interface WriteCursorLike<T = any> {
  sort(sort: SortSpec): WriteCursorLike<T>;
  skip(n: number): WriteCursorLike<T>;
  limit(n: number): WriteCursorLike<T>;
  project(projection: Record<string, number>): WriteCursorLike<any>;
  toArray(): Promise<T[]>;
}

export interface WriteCollectionLike<T = any> {
  find(filter: object, options?: { projection?: Record<string, number> }): WriteCursorLike<T>;
  findOne(filter: object, options?: { projection?: Record<string, number> }): Promise<T | null>;
  countDocuments(filter?: object): Promise<number>;
  aggregate(pipeline: object[]): { toArray(): Promise<any[]> };
  insertOne(doc: any): Promise<unknown>;
  updateOne(filter: object, update: object, options?: object): Promise<{ matchedCount: number; modifiedCount: number }>;
  updateMany(filter: object, update: object, options?: object): Promise<{ matchedCount: number; modifiedCount: number }>;
  replaceOne(filter: object, replacement: any, options?: object): Promise<unknown>;
  deleteOne(filter: object): Promise<{ deletedCount: number }>;
  deleteMany(filter: object): Promise<{ deletedCount: number }>;
  bulkWrite(operations: any[]): Promise<unknown>;
}

/** A writable connection to one database (client.db(name)). */
export interface WriteDbLike {
  readonly databaseName: string;
  collection<T = any>(name: string): WriteCollectionLike<T>;
}
