---
id: 20260817T113000Z-software-engineer-observation-both-mutants-run-and-watched-c062c84e
kind: observation
by: software-engineer
at: 2026-08-17T11:30:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
  - src/cli-options.ts
  - src/cli.test.ts
supersedes: 
---

# `A1` and `A4` — both mutants RUN and WATCHED, on a copy of the tree outside the repository

Four runs, in this order, every one executed. Nothing here is quoted from the ticket page or from
the Orchestrator's `Ready for Dev` note; every number below is one I measured myself.

The copy: `rsync -a --exclude node_modules --exclude .git` of the working tree into the session
scratchpad (`/private/tmp/claude-501/.../scratchpad/mutant`), with `node_modules` symlinked back.
**Outside the repository, never committed, deleted after the last run.** `git status --porcelain`
after deletion showed only `src/cli.test.ts` modified.

## 0 — the green baseline, measured before mutating

`npm test` on the branch tip **before any edit**: **861 passed (861), 30 files, exit 0**;
`src/cli.test.ts` 34 tests. The page's `856/856` is stale (five tickets have landed since the cut);
I did not carry it forward. **This is the number against which "the mutation did something" is
judged.**

## 1 — `A1`'s mutant on the UNGUARDED tree: GREEN. The falsifying witness reproduces.

`src/cli-options.ts:153` `flags: { ascii, unicode }` → `flags: { ascii: false, unicode }`, test file
untouched: **861 passed (861), 30 files.** The one-word mutation ships green — the premise of the
ticket, re-measured today rather than inherited.

## 2 — `A4`'s mutant on the UNGUARDED tree: already RED, and by whom matters

`flags: { ascii, unicode: false }`, test file untouched: **2 failed | 859 passed (861)**. The two
failures are both SPAWNED-CHILD rows, exactly as the page predicted:

- `A7 — --unicode on a pipe puts real chess glyphs in the board region`
- `A4 — the running entry point draws each colour from the human's side`

Both ride the byte-exact `white` child, which also carries `--colour white`. **`--unicode`'s wiring
had a guard; `--ascii`'s had none.** `A4`'s work was therefore to pin it AT THE RESOLVER, alone —
recorded here because "the suite is RED" alone would have hidden that this mutant was never the
silent one.

## 3 — control: guarded tree, UNMUTATED

`863 passed (863), 30 files` — the baseline plus my two new blocks. A guard that reds on a clean
tree would be worthless, so this run exists.

## 4 — both mutants on the GUARDED tree: RED, and the new block is among the failures each time

| mutant at `:153` | result | failing rows |
|---|---|---|
| `ascii: false` | **RED** — 1 failed \| 862 passed (863) | `ABC-061 A2` only |
| `unicode: false` | **RED** — 3 failed \| 860 passed (863) | `ABC-061 A2`, plus the two spawned-child rows from run 2 |

**`A1`: RED — observed.** **`A4`: RED — observed**, and the new resolver-level row is one of the
three, which is the part of `A4` a suite that was already red could not have given.

## 5 — a non-vacuity probe I ran that no criterion asked for

`orientation: resolved === WHITE ? "white-bottom" : "black-bottom"` → `orientation: "white-bottom"`
(a mismatched pair, the build `A3` names): **4 failed | 32 passed (36)** in `src/cli.test.ts`, and
`ABC-061 A3` is one of the four. **Honest limit: that run's coin landed BLACK.** The `A3` row is one
call by design (Test note 3), so on a white landing this particular probe would not have reached it —
the row asserts the pair on whichever side the coin lands, which is what `A3` asks for, not a
guarantee that any single run exercises the black side.
