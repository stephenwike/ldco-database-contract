import { migration as m0001 } from "./files/0001-dances-objectid-to-string";
import { migration as m0002 } from "./files/0002-ldco-timestamps-to-date";
import { migration as m0003 } from "./files/0003-ldco-user-ids-to-string";
import { migration as m0004 } from "./files/0004-bld-event-duration-to-number";
import { migration as m0005 } from "./files/0005-ldco-remove-stub-tracks";
import type { Migration } from "./types";

// Append new migrations in order; never reorder or edit applied ones.
export const migrations: Migration[] = [m0001, m0002, m0003, m0004, m0005];
