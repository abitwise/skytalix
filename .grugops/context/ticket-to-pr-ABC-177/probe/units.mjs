import { readFileSync } from "node:fs";
export const UNITS = {
  U1: [/go infinite holds the bestmove until (stop|ponderhit)/],
  U2: [/A6-e1:/], U3: [/A6-j1:/], U4: [/A6-e4:/], U5: [/A6-e5:/],
  U6: [/A7-i5:/, /A7-i6:/],
  U7: [/the token dropped, one bestmove/],
  U8: [/two sessions on the same seededRandom/],
};
export const unitOf = (name) => Object.keys(UNITS).find((u) => UNITS[u].some((r) => r.test(name)));
export function load(label) {
  const rows = readFileSync(`kill-${label}.jsonl`, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const ctrl = rows.shift();
  const byRow = {}; // row -> sorted killed ids
  const odd = rows.filter((r) => r.ran !== 15 || r.note);
  for (const r of rows) for (const n of r.failed) (byRow[n] ??= []).push(r.id);
  return { ctrl, rows, byRow, odd };
}
