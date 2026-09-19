---
id: 20260919T233000Z-software-engineer-artifact-ref-abc075-branch-commit-three-files-and-what-was-not-touched-e4a9d1b7
kind: artifact-ref
by: software-engineer
at: 2026-09-19T23:30:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ABC-081
  - ADR-0020
  - src/zobrist.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - memory-bank/30-architecture.md
  - plans/tickets/ABC-075-incremental-zobrist-key-seam.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-075/ticket-to-pr-ABC-075.md
supersedes:
---

# `ABC-075` — where the work is, and what this hop refused to touch

**Not a UAT-spec pointer**, so `sha` / `gate_run` / `content_hash` are absent by the contract's
own rule (required only on an `artifact-ref` that points at a committed `*.uat.spec.ts`). The
commit SHA is in the body because that is what the trace cites.

## Branch and commits

- Branch **`grugops/ABC-075-incremental-zobrist`**, created from `grugops/wave-2026-09-19` @
  `b65f5f1`, in the isolated worktree. **Not merged. Not deployed.**
- **`40b77ac`** — `feat(zobrist): grug build ABC-075 — zobristKeyAfterMove, ep keys on the square
  (ADR-0020)`: the three `src/` files, `memory-bank/30-architecture.md`, and this directory's
  `decision` / `claim` / `observation` notes plus nine `raw-*.txt` files.
- The commit after it (the branch tip) — `docs(ticket,trace,context,queue)`: the ticket's
  § Delivery, the `ABC-075 (build)` trace row, this note, and the queue transition. `src/` is
  byte-identical between the two commits, so every gate figure in the `claim` holds at the tip.

## Files under `src/` — exactly three (`git diff --numstat b65f5f1 40b77ac -- src/`)

| file | +/− | what |
| --- | --- | --- |
| `src/zobrist.ts` | +71 / −15 | ep clause → `epSquare !== NO_SQUARE`; `legal.ts` import gone; `zobristKeyAfterMove` added; module doc's second paragraph rewritten to cite ADR-0020 |
| `src/zobrist.test.ts` | +250 / −64 | `:49`/`:73` flipped; `:158` oracle re-pointed; `:276`/`:308` re-pointed (flagged); new `ABC-075` block (oracle walk, `A3`/`A4`, `ZOBRIST_DEEP`) |
| `src/zobrist.nfr.test.ts` | +19 / −30 | two spy rows → one structural row; header rewritten to say why |

## Outside `src/`

- `memory-bank/30-architecture.md` — the two edits ADR-0020 named as due here, plus one
  `_Updated:` line. Module-table depth for `zobrist.ts` left as `UNKNOWN - verify` (not re-measured).
- `plans/tickets/ABC-075-incremental-zobrist-key-seam.md` — § Delivery appended (nothing above it
  touched; the page stays under the 300-line budget).
- `plans/traceability.md` — one row appended (`ABC-075 (build)`), one `_Updated:` line; every
  pre-existing line asserted byte-identical by the append script.
- `.grugops/queue/` — `pending/ticket-to-pr-ABC-075.md` → `claimed/ticket-to-pr-ABC-075/` (bare
  `mkdir`, the atomic act, plus a hand-written `claim.md`) → `done/ticket-to-pr-ABC-075/`.

## Refused / not touched

- `src/apply.ts`, `src/position.ts`, `src/search.ts`, `src/engine.ts`, `src/quiescence.ts`,
  `src/turn-loop.*`, `src/legal.ts` — byte-identical (fences and `A6`).
- `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, `vitest.config.ts` — not opened for
  writing. `AGENTS.md` owes the `ZOBRIST_DEEP` command line (named in the `decision` § 6).
- `ADR-0020`, `ADR-0005`, `ADR-0006` — not edited.
- The `keys[]` array, its seeding, the TT probe and the repetition scan — `ABC-081`'s.
- Merge, deploy — neither. A `finding` — none (`human_admission` `off`).
- The `A5` bench (`raw-a5-bench.ts.txt`) was run from a temporary file inside `src/` and deleted
  before staging; it is NOT committed as a test and adds nothing to the lane.
