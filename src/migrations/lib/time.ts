const MOUNTAIN = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Denver",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

// Mountain wall-clock minus UTC, in ms, at the given instant (negative: -6h MDT, -7h MST).
function mountainOffsetMs(instant: number): number {
  const p = Object.fromEntries(MOUNTAIN.formatToParts(new Date(instant)).map((x) => [x.type, Number(x.value)]));
  const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return wall - Math.floor(instant / 1000) * 1000;
}

const NAIVE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/;
const WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;

// Offset-less strings are Mountain Time (MST/MDT); strings with an offset are exact. Returns null if unparsable.
// In the repeated fall-back hour the result is one of the two valid instants.
export function legacyTimestampToDate(value: string): { date: Date; assumedMountain: boolean } | null {
  if (WITH_OFFSET.test(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : { date, assumedMountain: false };
  }
  const m = NAIVE.exec(value);
  if (!m) return null;
  const ms = m[7] ? Number(m[7].slice(0, 3).padEnd(3, "0")) : 0;
  const wall = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]), ms);
  let instant = wall - mountainOffsetMs(wall);
  instant = wall - mountainOffsetMs(instant);
  return { date: new Date(instant), assumedMountain: true };
}
