import { migration as m0001 } from "./files/0001-dances-objectid-to-string";
import { migration as m0002 } from "./files/0002-ldco-timestamps-to-date";
import { migration as m0003 } from "./files/0003-ldco-user-ids-to-string";
import { migration as m0004 } from "./files/0004-bld-event-duration-to-number";
import { migration as m0005 } from "./files/0005-ldco-remove-stub-tracks";
import { migration as m0006 } from "./files/0006-retire-djfeed-user-profiles";
import { migration as m0007 } from "./files/0007-merge-bld-dj-history-into-djfeed";
import { migration as m0008 } from "./files/0008-djfeed-assign-early-dev-owner";
import { migration as m0009 } from "./files/0009-drop-ldco-event-registrations";
import { migration as m0010 } from "./files/0010-drop-ldco-user-favorite-venues";
import { migration as m0011 } from "./files/0011-delete-test-venue-events";
import { migration as m0012 } from "./files/0012-merge-bld-venues-into-ldco";
import { migration as m0013 } from "./files/0013-create-ldco-lessons-from-bld";
import { migration as m0014 } from "./files/0014-ldco-venue-time-zone-and-validation";
import { migration as m0015 } from "./files/0015-move-dj-feed-attendance-to-djfeed";
import { migration as m0016 } from "./files/0016-ldco-dances-publish-dates";
import { migration as m0017 } from "./files/0017-special-events-in-schedule";
import { migration as m0018 } from "./files/0018-drop-ldco-attendance-copies";
import { migration as m0019 } from "./files/0019-ticketed-events-drop-schedule-text";
import type { Migration } from "./types";

// Append new migrations in order; never reorder or edit applied ones.
export const migrations: Migration[] = [m0001, m0002, m0003, m0004, m0005, m0006, m0007, m0008, m0009, m0010, m0011, m0012, m0013, m0014, m0015, m0016, m0017, m0018, m0019];
