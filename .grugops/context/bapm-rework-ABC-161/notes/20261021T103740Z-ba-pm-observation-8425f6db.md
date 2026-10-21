---
id: 20261021T103740Z-ba-pm-observation-8425f6db
kind: observation
by: ba-pm
at: 2026-10-21T10:37:40Z
verified_by: 
confidence: high (each cell measured in scratch at afc8d43a; head column is a one-line scratch prototype, not a delivered head)
refs:
  - ABC-161
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - ABC-174
  - be6a5599
  - f6b63c1c
  - afc8d43a
  - 69610c5b
  - src/cli.test.ts
  - src/level-seam.ts
  - 20261021T102744Z-software-engineer-observation-b56b418c
supersedes: 
seal: sha256:97dadc9b9fa93842eb5ce99aa105d28673b81dad761c8313b992f93a59cf2687
---

# ABC-161 base readings at main afc8d43a, plus a scratch check of fix 1 per level: P11-L1..L3 blind on base; `call < 3` at seed 7 reds each of L1..L4

**Method.** `git archive afc8d43a` into the session scratchpad (outside the repository). `src/` and `AGENTS.md` are byte-identical to `69610c5b`; `git diff --stat 69610c5b afc8d43a -- src AGENTS.md` is empty. `node_modules` symlinked, private `TMPDIR`, one fresh copy per plant, each plant an exact-string edit asserted to occur once. Base lane: the whole default `NODE_OPTIONS=--max-old-space-size=128 npx vitest run`, JSON reporter. Head check: `src/cli.test.ts` alone, heap 400. One run at a time; no timing read. 0 copies left; `git status --porcelain` empty in the main checkout.

**Plants.**
- **P11**, in `src/level-seam.ts`: `const choice = choose(history.position);` becomes `const choice = createLevel(LEVELS[level as keyof typeof LEVELS], options)(history.position);`.
- **P11-LK**, K = 1..4: the same line becomes `const choice = (level === K ? createLevel(LEVELS[level as keyof typeof LEVELS], options) : choose)(history.position);`.
- **S2c**, in `src/cli-options.ts`: the `DIFFICULTY_VALUES.find(...)` line becomes `const value = next !== undefined && /^[1-5]$/m.test(next) ? next : undefined;`.
- **P9a-d**: `--difficulty 1|2|3|4|5` becomes `1|2|3|4`, `1|2|3|4|9`, `1|3|4|5` and `1|2|3|5`.
- **P9e**: `--colour white|black|random` becomes `--colour white|random`.

| plant | base, whole lane (59 files / 1987 tests) | head prototype `call < 3`, `src/cli.test.ts` (88) |
|---|---|---|
| none | 1987/1987, 0 skipped | 88/88 |
| P11 | 1 failed: `A8′` equivalence, "level 4, call 1" | not run |
| P11-L1 | 1987/1987 green | 1 failed: `A8′`, "level 1, call 2" |
| P11-L2 | 1987/1987 green | 1 failed: `A8′`, "level 2, call 2" |
| P11-L3 | 1987/1987 green | 1 failed: `A8′`, "level 3, call 2" |
| P11-L4 | 1 failed: `A8′`, "level 4, call 1" | 1 failed: `A8′`, "level 4, call 1" |
| S2c | 1987/1987 green | not run |
| P9a, P9b, P9c, P9d, P9e | each 1987/1987 green | not run |

The base column agrees with the SE's `…b56b418c` on every shared plant.

**Draws (mulberry32, `src/levels.ts` `seededRandom`, computed in scratch).**
- Seed 7 draws 0.0117, 0.0620, 0.9769, 0.6990. Two calls discriminate level 4 only: it is the one rate in (0.0117, 0.0620]. Three calls discriminate levels 1-4.
- Seed 1 draws 0.6271, 0.0027. It discriminates levels 1-4 at two calls. But level 1's first draw is not a blunder, so the row's non-vacuity line (`easiest?.kind` is `"blunder"`) would need rewriting.
- Seed 4294967295 draws 0.8964, 0.1895. It discriminates levels 1-2 only at two, three or four calls, so levels 3 and 4 are blind. This is the page's old second option.

**Slot.** Outside its own list, each `--difficulty` digit occurs at least once more in the `Dev / run` slot: `1` three times, `5` three times, and `2`, `3`, `4` once each. `4`'s extra occurrence is in "ADR-0045". `black` occurs once more, in `-- --colour black`. `white` and `random` occur only in the list.

**Not run here:** the head columns for S2c and P9a-e. Fix 2 and fix 3 were not prototyped, so their head reds are expected, not measured. Nor were lint, typecheck or build run on the prototype. The prototype is a feasibility check, not a delivered head.
