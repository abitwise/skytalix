---
task: ticket-to-pr-ABC-012
subtask: qe-abc012-review
role: qe-e2e
claimed_at: 2026-08-04T15:30:00Z
claimed_by: qe-e2e
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has no `scripts/claim.js`, so Workflow 17 step 2's atomic
`mkdirSync` claim primitive could not be executed and nothing here provides exclusivity.
Queue width is 1 and no contention is possible, so the claim is degenerate. Recorded rather
than glossed, exactly as the queued subtask instructed and as every prior task on this board
recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is
likewise absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-012/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a stamp — and nothing is
self-stamped.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`.

The `ref:` context folder was read BEFORE any review judgement was formed: the Orchestrator's
pull decision `20260804T120000Z-orchestrator-decision-f066a9d0` and the Software Engineer's
five notes (`…-decision-2c425d84`, `…-observation-f82d9b50`, `…-claim-4afa292e`,
`…-artifact-ref-f11fbe2a`, `…-observation-a3758376`). The ticket was then read in full. Every
claim handed forward by the Engineer is adjudicated from the merged evidence rather than from
its framing — the two `ABC-011` review passes found real defects by doing exactly that, and
both times the defect was in the SUITE and not in the production code.

---
completed_at: 2026-08-04T16:25:00Z
outcome: PASS — ABC-012 moved In Review -> In Security/NFR. In Review 1/3 -> 0/3, In Security/NFR
  0/2 -> 1/2; no limit approached, no override taken. THE VERDICT WAS EARNED BY BREAKING THE MODULE,
  not by re-running the Engineer's suite: 21 MUTANTS of the shipped src/history.ts — the Engineer's
  seven re-run as a control on its own table (all seven die exactly as reported) plus fourteen of
  this gate's own — with a positive control (the seven known kills) and a NULL CONTROL BY
  CONSTRUCTION (one behaviour-equivalent mutant that must survive, and does). THREE OF THE FOURTEEN
  SURVIVED ALL 221 DELIVERED TESTS, and all three are one shape: resetTo, the helper takeBack
  rebuilds the borrowed Position with, silently not copying `castling`, `blackToMove` or `epSquare`.
  ONE ROOT CAUSE — every acceptance test anchors at the START position and takes back only at EVEN
  ply counts. src/history.ts is CORRECT on all three: holes in the SUITE, not defects in the module,
  which is where both ABC-011 passes also landed. CLOSED BY 5 ADDED TESTS, each aimed at a mutant
  that actually survived, plus ONE assertion added to criterion 2's own test. Suite 221 -> 226 / 10
  files / skip 0; lint, typecheck, build all exit 0; src/history.ts still 100% on all four axes; NO
  PRODUCTION CODE CHANGED (md5 12f8c562… identical after 21 mutate-and-restore cycles). THE THREE
  HANDED-FORWARD ITEMS RULED FROM THE EVIDENCE: (1) criterion 2 unsatisfiable as worded — UPHELD,
  verified with the COMPILER (TS2820, null control compiles clean); its INTENT is met and GREEN; the
  wording routed to BA/PM with neither the ticket nor merged gameend.ts edited; and NEW — gameStatusOf
  CAN return result:"draw" for repetition at FIVEFOLD, so the criterion is re-wordable either way, and
  the fivefold test now exists. (2) criterion 2's test not pinning the BOARD half of takeBack —
  CONFIRMED and CLOSED, that mutant now dies to it and to 6 tests. (3) two one-assertion kills —
  CONFIRMED, both now have two independent killers. TWO CORRECTIONS OF RECORD: the grep -vxF -f
  instrument is NOT unsound — the shell's `grep` shims to ugrep 7.5.0 and the "absent" counts ARE the
  files' blank-line counts 1:1 across four files, /usr/bin/grep returns 0 on the identity control; and
  `npx vitest run --coverage` does NOT delete 22 tracked files — plain deletes 0 and modifies 15,
  filtered deletes 12 and modifies 3, both reproduced under a controlled restore, with the mitigation
  --coverage.reportsDirectory outside the repo VERIFIED to leave coverage/ untouched. NAMED NOT FIXED:
  takeBack(history, NaN) silently discards the ENTIRE game (undefined too), a fractional plies takes
  back more than asked, and src/history.ts:42 claims the borrow contract "is documented and tested"
  when it is not — and contradicts the decision note about holding position across a takeBack.
  DECLINED WITH A REASON: the double-push repetition test, which would assert a src/zobrist.ts
  property and belongs on ABC-011's row. THE FIVE NFR BARS WERE DELIBERATELY NOT RE-MEASURED —
  Security/NFR owns them — and nothing cost-shaped was added: no wall-clock assertion in any new test.
  Criterion 9 verified at LINE level with a working null control: all nine pre-existing test files
  +0/-0. ABC-009, ABC-010 and ABC-022 carried, not fixed. NO PR — no git remote; nothing merged,
  nothing deployed, a human holds both.
moved: pending/ -> claimed/ticket-to-pr-ABC-012-qe/ -> done/ticket-to-pr-ABC-012-qe/ — ALL BY HAND
  (no scripts/claim.js in this install).
