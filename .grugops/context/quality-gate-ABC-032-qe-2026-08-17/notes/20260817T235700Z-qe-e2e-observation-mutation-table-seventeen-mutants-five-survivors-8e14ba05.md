---
id: 20260817T235700Z-qe-e2e-observation-mutation-table-seventeen-mutants-five-survivors-8e14ba05
kind: observation
by: qe-e2e
at: 2026-08-17T23:57:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A1
  - A3
  - A5
  - A7
  - src/san.ts
  - src/san.parse.test.ts
supersedes:
---

# The mutation table — 17 mutants of `src/san.ts`, 5 survivors, all 5 now killed

A guard that cannot fail is not a guard. Each mutant below was written into `src/san.ts`, the suite
run, and the module restored from an in-memory copy of the original; the harness asserts the file is
byte-identical afterwards and `git diff HEAD -- src/san.ts` is empty. **No production line is
changed by this hop.**

Unless stated, the run is `npx vitest run src/san.parse.test.ts src/san.test.ts`.

| mutant | before my rows | after |
|---|---|---|
| `M1` single match returns `ambiguous` instead of `move` | RED (15) | RED |
| `M2` `resolve` returns a COPY of the matched `Move` — the (2b) violation | RED (14) | RED |
| `M3` `no-such-move` collapsed into `unreadable` | RED (2) | RED |
| `M4` capture marker agreement deleted on the piece path | **GREEN — SURVIVED** | RED (1) |
| `M5` pawn capture/origin-file agreement deleted | **GREEN — SURVIVED** | RED (1) |
| `M6` file qualifier ignored | RED (4) | RED |
| `M6b` rank qualifier ignored | RED (1) | RED |
| `M7` `text.trim()` removed | **GREEN — SURVIVED** | RED (1) |
| `M8` second table: `PIECE_MOVE` re-spelled `/^([NBRQK])…/` | **GREEN — SURVIVED** | RED (1) |
| `M9` second table: promotion letters as a private `{2:"N",…}` map | RED (2) | RED |
| `M10` second table: castle strings re-spelled by template concatenation | **GREEN — SURVIVED** | still GREEN — see below |
| `M11` destination square ignored on the piece path | RED (11) | RED |
| `M12` the `typeof text !== "string"` guard removed | RED (1) | RED |
| `M13` the `0-0` tolerance removed | RED (2) | RED |
| `M14` second table: castle strings in a regex literal `/^O-O(-O)?$/` | **GREEN — SURVIVED** | RED (1) |
| `M15` second table: piece letters decoded by a `switch` with string cases | RED (1) | RED |
| `M16` the ONE table is WRONG — knight letter `"N"` → `"S"` | GREEN under `A1` alone; RED on the full suite (37) | unchanged |
| `M17` the ONE table is WRONG — castle strings swapped inside `body` | GREEN under `A1` alone; RED on the full suite (7) | unchanged |

## `M10` survives on purpose, and I am not claiming otherwise

`M10` spells the castle strings as `` `O-${"O"}` `` — a second table deliberately written so no text
scan can see it. **A structural text assertion bounds accident, not an adversary**, and I did not
pretend otherwise by writing a row that chases it. What `A7` plus my two rows now guarantee is that
a second table cannot be introduced by an engineer writing the module's own idiom; a determined
obfuscation still passes, and `ADR-0004` clause 2 rests on review for that case.

## Where `M16` / `M17` land, because it decides how much `A1` is worth

Both are wrong-but-CONSISTENT grammars: the one table is changed, and because the parse direction
derives from the forward one, the round trip still closes. **`A1` alone is green on both.** What
kills them is the pre-existing forward-direction corpus — `M16` turns 37 tests red across 8 files
(`src/san.test.ts`, `src/status-panel.test.ts`, the history and frame suites), `M17` turns 7 red in
4 files including `src/san.qualifier.hardening.test.ts`. That corpus is merged, `A6` fences it, and
this ticket left it intact — which is exactly why `A1` is affordable as a round trip.
