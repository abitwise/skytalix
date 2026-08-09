---
id: 20260809T114000Z-software-engineer-observation-60352bd0
kind: observation
by: software-engineer
at: 2026-08-09T11:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - src/moves.ts
  - src/moves.castling.test.ts
  - src/perft.test.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - agent-factory/workflows/05-pr-quality-gate.md
  - AGENTS.md
supersedes: 
---

# The gates as they actually ran, the red-before-green record, and all fifteen counts

Every command below was run by this role on the branch tip. Nothing is quoted from another note and
nothing is reported as passing that did not run.

## The four mandatory gates, plus the rest of the Workflow 05 sequence

| step | command (from `AGENTS.md`) | result |
|---|---|---|
| install | `npm install` | exit 0 — no dependency change; `package.json` and `package-lock.json` untouched |
| lint | `npm run lint` | **exit 0**, and **zero autofix passes were needed** — 0 of 2 `self_fix_attempts` spent |
| typecheck | `npm run typecheck` | exit 0 |
| unit | `npm test` | **337 passed (337) on 15 files** |
| build | `npm run build` | exit 0 |
| skip count | `npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'` | **0** |
| deep perft (`A9`) | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 exact**, 36.93 s |
| e2e | — | `UNKNOWN - verify` |
| test-integrity checker | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit 2** |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | `UNKNOWN - verify` — absent in this install |

**The suite baseline was measured, not subtracted.** `npm test` on the tip **before** any edit read
**304 passed (304) on 14 files**, which matches the figure the Orchestrator recorded at the pull and
the figure BA/PM's mutant campaign was measured against. After the change: 337 on 15 files. The delta
is my 33 new tests and nothing else.

**The test-integrity exit 2 is recorded as an ERROR and NOT as a pass.** `.grugops/test-skips.md` does
not exist — checked with `ls`, not assumed. Workflow 05 step 3 defines exit 2 as *"the checker could
not run"*, explicitly distinct from the exit-1 human-only short-circuit. **No registry file was
created**: an agent may not self-author a justification to clear its own gate, and with a skip count of
0 nothing is owed a justification. Every prior subtask on this board recorded this identically.

**E2E is `UNKNOWN - verify` rather than skipped-and-called-fine.** The `AGENTS.md` E2E slot is
`UNKNOWN - verify`; there is no UI surface and no runnable game until `EPIC-006`. `quality.ui_e2e` is
`ui-or-critical-path` and this change has no UI surface.

**The two lint infos are pre-existing.** They are `biome.json` schema and deprecation notices
(`biome.json:2:14` and `biome.json:12:13`), unrelated to this ticket. Flagged, not fixed — coding
rules 9 and 12. `npx biome check` on my two files alone reports zero.

## Red before green, proved rather than described

`quality.tdd` is `encouraged` and the inner loop ran red-first. Against the **unfixed** tree the new
file read **23 failed / 10 passed of 33**.

The 10 that passed are exactly the four legal-castle controls and the six `A7` perft-purity rows.
Two things follow, and both are about the ticket rather than about my code:

- **`A7`'s *"(Today: passes)"* is confirmed on the repository tip**, not just on a scratch copy.
- **`A7` was ABSENT, not failing.** Its criterion says *"must stay green, **and must be present**"*.
  There was no `legalMoves` purity walk over the perft table anywhere in the suite before this file;
  `src/legal.test.ts` walks that table for king-safety, not for purity. So the work `A7` asked for was
  the writing of it.

All 23 assertions that describe the defect were red before the fix existed.

## All fifteen post-fix counts matched the delivered diff on the first run

No discrepancy. **Nothing was adjusted in either direction** — no test was bent to fit the code and no
criterion was edited. Measured on the delivered diff:

```
A1  4k3/8/8/8/8/8/8/K7 w KQ - 0 1     3 moves · 0 FLAG_CASTLE · toFen + 128 bytes + 5 scalars pure
A2  (same FEN, three calls)           3, 3, 3
A3  4k3/8/8/8/8/8/8/4K3 w K - 0 1     5 moves · 0 FLAG_CASTLE in generateMoves AND legalMoves
A4  K6R w K · R6K w Q · k6r b k · r6k b q    16 · 16 · 16 · 16   0 castles both layers, pure
A5  K3B2R · R3N2K · K3b2R · k3b2r            19 · 17 · 13 · 19   0 castles both layers, pure
A6  4K2B · N3K3 · 4k2b · 4K2b                12 ·  7 · 12 ·  5   0 castles both layers
```

Controls, also measured: kiwipete returns **48** legal moves with **2 castles still offered** and is
pure across the call (128 bytes and five scalars, and `toFen` round-trips) — the Orchestrator's own
control row reproduces exactly. The four legal castles return **15 · 16 · 15 · 16** with exactly one
`FLAG_CASTLE` each.

That makes **three** independent derivations of those fifteen numbers: BA/PM's seven candidate builds,
the Orchestrator's independently written fix, and this diff. The ticket carried two.

## Two things about how the tests are shaped, because a reviewer will ask

**`A8`'s line-level requirement is mechanical, not a judgement.** The 33 new tests went into a **new
file** (`src/moves.castling.test.ts`) rather than being appended to `src/moves.test.ts`, specifically
so that *"no existing test is modified, verified at line level"* is checkable by
`git diff --name-only -- 'src/*.test.ts'` returning **empty**. Appending would have made the claim an
argument about which changed lines were tests and which were imports.

**`A6` is asserted on the offer only, and that is structural.** Family 3 leaves the position
byte-identical because the make/unmake pair round-trips the impostor exactly, so no purity assertion
can ever see it and only a `FLAG_CASTLE` count can. Re-verified here rather than inherited from the
correction block. A reviewer looking for a purity row on `A6` will not find one and should not.

## `A9` — what was run, and the stronger statement beside it

The deep lane was run on the **delivered** tree and is **32/32 exact in 36.93 s**, before review as
`## Test notes` requires. **Nobody had run it on either tree for this ticket** — both Orchestrator
notes say so explicitly.

It was **not** run on the pre-fix tree. The deep lane is the oracle that the change is invisible to
legal play, and the pre-fix tree's 32/32 is `ABC-006`'s standing result rather than a comparison this
ticket needs. The stronger statement, which is structural rather than measured: `makeMove` clears a
castling right whenever the king or the matching rook leaves its home square or that rook is captured
(`src/apply.ts:52-59`), so in any position reachable from a legal start the right being set implies
both pieces are home — which is why the two added conditions cannot alter a single node of the perft
tree, and why 32/32 and the whole default perft lane are unchanged.

## What this note does NOT establish

- **A terminal gate verdict.** `READY_FOR_HUMAN_REVIEW` is the gate's to emit, and QE/E2E owns the
  `In Review` exit. The four mandatory gates passed; that is a fact about commands, not a verdict.
- **A coverage figure.** None was measured. `## Problem` is explicit that a test which only raises
  coverage adds nothing here, `src/legal.ts` having been at 100% when the defect shipped.
- **`NFR-001`.** In its own companion note; no throughput figure appears above.
