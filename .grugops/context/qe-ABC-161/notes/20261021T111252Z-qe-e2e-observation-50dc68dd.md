---
id: 20261021T111252Z-qe-e2e-observation-50dc68dd
kind: observation
by: qe-e2e
at: 2026-10-21T11:12:52Z
verified_by: 
confidence: high (12 scratch probes run against the head row)
refs:
  - ABC-161
  - grugops/ABC-161
  - 5e755bcb
  - ee1818bb
  - 35788fd4
  - grugops/qe-ABC-161
  - src/cli.test.ts
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
  - A3
  - QE-101-b
  - QE-161-a
  - QE-161-b
  - QE-161-c
  - AGENTS.md
supersedes: 
seal: sha256:6c5fb18ea4573fae30b97de6e0cfd03452dde3fa5037ae8368fd5f9555d83fdd
---

# ABC-161 fix 3 graded beyond the plants: the `|`-list capture is blind to anything after the first non-word character (6 survivors); spaced, slashed, ranged or single-value lists red loudly

**Method.** The head `src/cli.test.ts` ran in the scratch tree, one file at heap 400, `-t "A3 — the documented option list"`, with exactly 1 test run per probe. A scratch copy of `AGENTS.md` got one exact-string edit per probe. The real `AGENTS.md` (B0) passes.

| probe | slot text | head row | reading |
|---|---|---|---|
| B1 | `--difficulty 1\|2\|3\|4\|5\|` | **passed** | trailing `\|` unread |
| B2 | `--difficulty 1\|2\|3\|4\|5\|+3` | **passed** | an unaccepted `+3` is documented |
| B3 | `--difficulty 1\|2\|3\|4\|5 \|6` | **passed** | ` \|6` unread |
| B4 | `--colour white\|black\|random-ish` | **passed** | a wrong word is read as `random` |
| B5 | `--difficulty 1\|2\|3\|4\|5.5` | **passed** | `5.5` is read as `5` |
| B10 | `--colour white\|black\|random\|+black` | **passed** | `\|+black` unread |
| B11 | `--difficulty 1\|2\|3\|4\|5\|0x6` | red | `0x6` is a word, so it is read |
| B8 | `--difficulty 1\|2\|3\|3\|4\|5` | red | a duplicate reds; the compare is on sorted arrays, so it is multiset-equal |
| B6 | `--difficulty 1 \| 2 \| 3 \| 4 \| 5` | red | "lists after --difficulty: expected 0 to be 1" |
| B7 | `--difficulty 1/2/3/4/5` | red | same |
| B9 | `--difficulty 1-5` | red | same |

- **Why the survivors survive.** The capture is `${option} (\w+(?:\|\w+)+)`, with no right-hand delimiter. It ends at the first non-`\w` character, so whatever follows the last word is never read: `|`, `+`, `-`, `.` and spaces all end it. The P9 family edits words inside the run, which is why all five P9 plants red.
- **Single-value list.** No current option takes exactly one value, so this is hypothetical. `"--x a"` against the same regex yields 0 matches, so such an option would red at `expect(lists.length).toBe(1)` on a correct slot. It is over-strict but loud, never silent.
- **An option that takes a value but has no `|` list** (B6, B7, B9) reds at the count. That is loud, and arguably right: the row now requires the `|` form, though the slot's own WRITING RULES do not say so.
- **The last line** (`listed` vs `acceptedValues`) is built from the resolver's `accepted` sets, not from the documented `values`.
  - It is not a documentation check by itself. The comment's "every value word belongs to some documented list" holds only through the per-option equality above it.
  - It does catch a value word that no option accepts, or an option that drops out of `valuedOptions`.
- **`valuedOptions`** comes from `resolveOptions([option, value]).ok` over the closed set. A future free-form option (`--seed <n>`) would get no list check. It is not live: the resolver's closed enumeration has no such option.
- `option` is interpolated into the `RegExp` unescaped. That is safe for today's `-` and letters, and not live.
