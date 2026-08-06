---
id: 20260807T122500Z-security-nfr-artifact-ref-81ea033e
kind: artifact-ref
by: security-nfr
at: 2026-08-07T12:25:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - src/render.ts
  - .grugops/queue/done/ticket-to-pr-ABC-014-sec/
  - 20260806T110000Z-orchestrator-observation-c41e9b07
  - 20260807T113000Z-orchestrator-decision-8f5a2b60
supersedes: 
---

# What this subtask produced — files, commands, the queue transition, and what did NOT change

## Branch

`grugops/ticket-to-pr-ABC-014`, on top of the Orchestrator's `fd9a736`. **Not merged.** **No PR** —
this repo has no git remote, so `autonomy: "pr"` has always meant "branch + gate" here.

## Files changed — three, all under `plans/`, and NOTHING under `src/`

| File | Change |
|---|---|
| `plans/nfr-catalog.md` | **exactly 3 lines**: the `_Updated:` header, the `NFR-002` row, and the `Board-scan compute` row of the section's unknowns table. **`NFR-001` and `NFR-003`–`NFR-007` byte-identical; `NFR-002`'s target cell byte-identical — no target moved.** Verified by hashing the cells before and after |
| `plans/traceability.md` | **exactly one row** (`ABC-014`), three cells — `NFRs`, `UAT`, `Status` — plus the `_Updated:` header. The diff is one line. `Code` and `Tests` untouched |
| `plans/board.md` | `In Security/NFR` → `Ready for UAT`, 1/2 → 0/2 and 0/4 → 1/4, with the gate record |

## What did NOT change, verified rather than claimed

- **`src/render.ts` md5 `733bc67fec523a7f41016bea2b026e1d`** — identical to the Engineer's published
  figure and to QE's independent re-check, read off the file at the end of this subtask.
  **`git diff HEAD -- src/` is empty. No production code and no test was changed by this gate.**
- **`src/__snapshots__/render.test.ts.snap` untouched.** QE's destructive snapshot experiment was
  **deliberately not reproduced** — the Orchestrator already verified the structural half on the
  config surface and routed the remedy to the `AGENTS.md` Scribe; deleting a tracked file to
  re-derive a result derived twice would dirty the tree this gate is working in.
- **`coverage/` untouched — and this gate ran no `--coverage` command at all**, so the hazard that
  dirtied it for the Engineer and for QE never arose. `git status --short coverage/` is empty. It
  remains a stale tracked artifact last written at `ABC-007`; flagged, not deleted (AGENTS.md
  rule 12).
- **No dependency was added or changed.** `package.json` untouched.
- **No ticket prose, acceptance criterion or `## Out of scope` line was edited.** The `ABC-014`
  ticket file's `status` / `column` frontmatter still reads `in-development` — the third flag on
  this ticket, and the Orchestrator's to move.
- **`plans/metrics.md` was not touched.** Its own header names the daily sweep and the retro as its
  update owners; this move makes it staler again (`In Security/NFR` now 0/2, `Ready for UAT` 1/4)
  and that is recorded rather than silently left.

## Commands run — all of them, with their real results

| Command | Result |
|---|---|
| `npm test` | **253 passed / 11 files / 0 failed** |
| `npx vitest run --reporter=json … jq '.numPendingTests + .numTodoTests'` | **0** — the `AGENTS.md` command, not eyeballed |
| `npm run lint` | **exit 0**, 0 errors, 2 pre-existing biome config-schema infos |
| `npm run typecheck` | **exit 0** |
| `npm run build` | **exit 0** |
| `md5 -q src/render.ts` | `733bc67fec523a7f41016bea2b026e1d` |
| `git diff HEAD -- src/` | empty |

**No command went RED at any point in this subtask.**

## The three throwaway harnesses, none committed

All ran **outside the repository**, read-only against `src/`:

1. **the adversarial probe** — alphabet closure over 32 frames, 27 hostile `mode` values, 27 hostile
   `orientation` values, the out-of-domain byte table, the off-board 0x88 stuffing, and the purity /
   information-disclosure checks;
2. **the prototype-pollution probe** — with a **live-pollution control** so the negative results are
   not vacuous, plus a repo-wide pollution-sink scan with comments stripped;
3. **the NFR harness** — 11 rounds × 2,000 iterations, warm-up discarded, cell order rotated per
   round, medians of per-round means, run twice as two independent processes, `parseFen` outside the
   timed region, checksum against elision. Plus a fourth micro-harness that **attributed** the
   black-bottom cost delta to `src/render.ts:146` rather than guessing at it.

## Read before acting — Workflow 16, at source, in `at` order

All eleven prior notes were read **in `at` order at the source**, not from this prompt, which
inlined none of them. **The correction was caught where it was written:**
`20260806T110000Z-orchestrator-observation-c41e9b07` corrects one sentence of the pull note — the
standing perft FEN table holds **SIX** positions, not seven. **Re-counted independently at the
source for this gate** (`grep -c "^    fen:" src/perft.test.ts` → 6) rather than taken on the
correction's word, because the correction is itself about a number that was taken off a grep. The
six are transcribed into this gate's harness and are the bar's population.
`20260807T113000Z-orchestrator-decision-8f5a2b60` routes the snapshot-net hole to the Scribe; it is
**not re-routed here**.

Then, at source: `plans/tickets/ABC-014-board-frame-renderer.md` in full, `plans/nfr-catalog.md`,
`plans/board.md`, `plans/traceability.md`, `.grugops/factory.config.json`, `AGENTS.md`,
`agent-factory/checklists/security-nfr-checklist.md` filtered to L1, and the shipped
`src/render.ts` and `src/position.ts` line by line. **Nothing measured by an earlier role was
inherited.**

## Queue transition — Workflow 17 run BY HAND

This install has **no `scripts/` directory at all**, so step 2's atomic `claimTask` could not be
executed. The subtask moved

```
pending/ticket-to-pr-ABC-014-sec.md
  -> claimed/ticket-to-pr-ABC-014-sec/ticket-to-pr-ABC-014-sec.md    (2026-08-07T12:00:00Z)
  -> done/ticket-to-pr-ABC-014-sec/                                  (2026-08-07T12:30:00Z)
```

**by hand**, with a `claim.md` registry record written into the claim directory carrying `task` /
`subtask` / `role` / `claimed_at` / `claimed_by` / `done_at` / `method`. The claim directory was
created with a plain `mkdir` — still atomic, still `EEXIST` on a second writer. The whole claim
directory moves into `done/`, keeping the registry record beside the subtask file, which is the
shape `done/ticket-to-pr-ABC-014-dev/` and `.../-qe/` already use on this board. Width is 1 and no
contention was possible, so the claim is degenerate. **`depends_on: ticket-to-pr-ABC-014-qe` was
checked in `done/` at the source before the claim, not taken from the activating prompt.**

This install also has **no `scripts/context-io.ts`**, so this note and its siblings are hand-written
into `notes/` in the schema's exact shape (`agent-factory/contracts/context-note.md`). **No
`finding` is written — none is admissible without a §14 gate to issue a stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing was
self-stamped.** The kinds used across this subtask are **`observation` (×2), `decision`, `claim` and
`artifact-ref`**. No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here. Recorded as a degradation, not glossed.
