# `arch-ABC-221-records`: the dated lines added to `ADR-0052` (D4, D8, § Status, A9) and `ADR-0054` (probe value, amendment status), and where `QE-221-b` goes

All of these are in commit `db8fea11`, records only. Each line is traced to a sealed note or a merge on `main`, and none
changes a decision.

## `ADR-0052`
- **D4 (`SE-221-a`; QE confirmed it in `qe-ABC-221` `…f9b43b6d`).** "With no `movestogo`, 80 moves leave ≥ 117 s" is
  corrected.
  - On the shape the sentence names (sudden death at 15 min, 80 moves, nothing added) the clock reads **17 205 ms**
    after move 80, and that is the closest call. This is `arch-epic009-settings` `raw/alloc.txt` § "sudden death 15
    min, 80 moves", and QE's `se221a.mjs` reads 17 204.53.
  - 117 735 ms belongs to § "40/15, no movestogo sent, 80 moves", where 900 000 ms is added after move 40.
  - The bound (≥ 1 000 ms on every move) holds on both shapes. `ABC-221` pins each shape with its own row.
- **§ Alternatives A9:** the same "≥ 117 s" figure gets a dated pointer to 17 205 ms.
- **D8 (`SE-221-b`, `SEC-221-b`):** the ruling, in the decision note of this task.
- **D8 (`QE-221-b`):** the carrier line for the stale `src/levels.ts` comment (below).
- **§ Status:** a dated line says `uci-clock-mode` and D6's clamp are in force since `ABC-221`'s merge (`af32f82c`,
  `9395d8dc`).

## `ADR-0054`
- **§ Proposed amendment § Context, under QE's probe (`SE-242-a`, answered in `qe-ABC-242` `…b9f3cd67`,
  `raw/probe/se242a.txt`).** Since `ABC-228`'s merge (`e42b637b`), the probe's base value for `d8e8` has read **−1020**,
  not −1013.
  - Full list: `[d8e8 −1020, d8c8 −1030, d8d7 −1030, d8e7 −1015, d8c7 −1031]`, with and without the keys.
  - The value was −1013 at `ABC-230`'s merge (`24f3e322`). The reading is the same at `1f6abec4`, `5953c631` and
    `4387d4e8`.
  - `d8e8` is still the third occurrence and the strict second-best, so the gap and A1–A6 read as before.
- **§ Proposed amendment § Status:** a dated line says "in force at `ABC-242`'s merge" is met (`af5b2b49`). Where the
  heading and the file's § Status say "not in force" or "until then", that is history. The heading itself was left as
  it is, because other records cite it by name.

## `QE-221-b`: where it goes
- **The carrier is `ADR-0052` D8's dated line** under "`src/levels.ts` … do not change". The **vehicle is the next ticket
  whose diff touches `src/levels.ts`.** That ticket corrects the comment in the same diff, as comment-only lines, in
  D6's words: the clamp sits at the largest ceiling in force (60 s), at or above every level ceiling. BA/PM names the
  D8 line on that ticket's page when the ticket is cut.
- **No ticket of its own.** A comment-only `src/` edit does not pay for a pass through the gates on its own.
  - `ABC-245` (`src/levels.test.ts` only) cannot carry it.
  - A `QE-221-a` test ticket in `src/uci-session.test.ts` cannot carry it either.
- **Read at `main` `9c008db4`, added to the same line:** two more words in the header have been stale since `ABC-228`
  (`e42b637b`).
  - `:42` "`NFR-004`'s 3 s" now reads 4 s, because `LEVELS[5]` is 4 000.
  - `:49–50` "at least 2 s under it" is 1 s at level 5 (4 000 under 5 s).
  - The `:43` "`NFR-005`'s reading … at 3 s" was not checked against `NFR-005`: `UNKNOWN - verify`, for that ticket's
    SE.
- `bapm-ABC-221-fold` disposes `QE-221-b` on `ABC-221`'s page, beside this hop. This note gives it the ADR line to cite.

## Not touched
- `src/`, `tools/`, `data/`, tickets, the board, and `ADR-0044`/`ADR-0045` (BA/PM's folds). Nothing was run, timed,
  pushed or merged.
