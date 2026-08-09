---
id: 20260809T232403Z-security-nfr-artifact-ref-a5afa227
kind: artifact-ref
by: security-nfr
at: 2026-08-09T23:24:03Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
  - plans/tickets/history/ABC-022-board-history.md
supersedes: 
---

# Artifacts produced and consumed by the `ABC-022` Security/NFR gate

Branch `grugops/ticket-to-pr-ABC-022`. **No PR** — this repository has no git remote, so
`autonomy: pr` has always meant "branch + gate" here. **Nothing merged, nothing deployed.**

## Changed in `src/` — NOTHING

`git status --short -- src/` is **empty**. `src/moves.ts` is byte-unchanged at md5
`6335b452fc21ffe2d0f902ecab930840`. No production line, no test row, no comment.

## Changed in `plans/` — four files

- **`plans/board.md`** — `ABC-022` moved `In Security/NFR` -> `Ready for UAT`; `In Security/NFR`
  1/2 -> 0/2, `Ready for UAT` 0/4 -> 1/4; the `_Updated:` header **replaced, not stacked**, per the
  board's own rule. `4 +/4 −` — the header, the two headings and the one moved row. All **12**
  numbered column headings re-verified against their live row counts (**0 mismatches**).
- **`plans/tickets/history/ABC-022-board-history.md`** — this hop's board entry **prepended**
  (newest first, the file's stated order), plus the replaced board header preserved **verbatim**
  (782 chars). `133 +/0 −` — a pure prepend; nothing was rewritten, summarised or dropped.
- **`plans/tickets/ABC-022-…md`** — frontmatter `status`/`column` moved with the board, and a
  `## Security / NFR` section appended **before `## Board history`** (the `ABC-009` precedent).
  Verified mechanically rather than by eye: **`314 +/2 −`, and both deletions are the two frontmatter
  lines**; **`## Acceptance` hashes identically before and after
  (`7123d5c641045a44c6f63c2c20dab415`)** — the insertion script recomputes that hash and refuses to
  write if it moves.
- **`plans/traceability.md`** — **one row edited (`ABC-022`), TWO cells** (`NFRs`, `Status`), one
  `_Updated:` header line inserted. Table rows **31 before and after**, the `ABC-022` row at exactly
  **11 unescaped pipes** before and after, **exactly one row line changed**, and both appended
  strings asserted **pipe-free and newline-free BEFORE writing** — the script refuses rather than
  half-writing. **The `UAT` and `Release` cells were asserted empty and LEFT EMPTY**: this gate does
  not rule on UAT.

`node tools/grugops/reference-check.js` reports **"No findings"** on all four.

## Queue

`.grugops/queue/claimed/ticket-to-pr-ABC-022-sec/` — claim directory created by a plain atomic
`mkdir` (exit **0**, so first writer), `claim.md` written, the subtask file moved in from `pending/`
and on to `done/` at the end. All by hand; see the claim record for why.

## Measurement harnesses — ALL OUTSIDE THE REPOSITORY, none committed

Under the session scratchpad, **one full tree copy per state** so no two tree states share a
process, `node_modules` symlinked to the repo and a `tsconfig.json` narrowed to `src/**`:

| tree | `src/moves.ts` md5 | what it is |
| --- | --- | --- |
| `t-fix` | `6335b452fc21ffe2d0f902ecab930840` | `git archive HEAD src`, `/usr/bin/diff -r` verified identical to the working tree |
| `t-pristine` | `0e247853ab2c05887c76105ff83d8621` | `git archive main src` |
| `t-twin` | `6335b452fc21ffe2d0f902ecab930840` | `cmp`-verified byte-identical twin of `t-fix` (31/31 files) — the NULL CONTROL |
| `t-count` | `9b0b488d4d58bd5798b2959684de1579` | `t-fix` + two anchored counter insertions; **202/202 green**, so it still behaves like the tip |

Probes, all written for this hop: `mutate.js` (anchored single replacement asserting `count == 1`
before writing and that the file changed after), `seccount.ts` (the `NFR-001` count on a plain
`legalMoves`-driven walk, roots and `fast` depths parsed out of `src/perft.test.ts`),
`seccount-bench.ts` (the same counters over the **clock's own** perft-bench population),
`secmax.ts` (the per-call bound over all 18,357 generator calls), `seczero.ts` (the
structurally-zero cell — `generateMoves` / `legalMoves` / `gameStatus` at startpos),
`epsweep.ts` (the exhaustive `epSquare` = -1..255 x 2 bases sweep, run on `t-fix` **and**
`t-pristine`), and `bench.sh` (the rotated throughput rounds, one OS process per reading).
`src/perft-bench.ts` was run per tree for the throughput rounds. Every probe **prints the FEN it used
and re-parses it**, aborting if `toFen(parseFen(fen))` does not render back identically.
`tsc --noEmit` exit 0 on every tree before any result was believed — and the one failure it caught
was in this gate's own probe file, recorded in the gates note rather than quietly fixed.

## Consumed

`agent-factory/roles/security-nfr.md`, `agent-factory/checklists/security-nfr-checklist.md`
(filtered to `L1` at read time — 70 of 345 requirements, counted at the source),
`agent-factory/workflows/16-context-read-write.md`, `agent-factory/workflows/17-task-claim.md`,
`agent-factory/contracts/context-note.md`, `agent-factory/_commit-convention.md`,
`.grugops/factory.config.json`, **all forty-nine prior notes** in
`.grugops/context/ticket-to-pr-ABC-022/notes/`, the subtask brief,
`plans/tickets/ABC-022-…md` (in full, all 1,247 lines), `plans/board.md`, `plans/traceability.md`,
`plans/nfr-catalog.md` (the `NFR-001` and `NFR-005` rows, the measured-rows notes, the
availability ruling and the ASVS-deferral section), `plans/tickets/ABC-010-fen-semantic-validation.md`,
`plans/tickets/history/ABC-022-board-history.md`, `plans/tickets/history/ABC-009-board-history.md`
(the `## Security / NFR` precedent, via `.grugops/queue/done/ticket-to-pr-ABC-009-sec/claim.md`),
`memory-bank/00-index.md`, `src/moves.ts`, `src/legal.ts`, `src/fen.ts`, `src/history.ts`,
`src/gameend.ts`, `src/zobrist.ts`, `src/apply.ts`, `src/perft.ts`, `src/perft.test.ts`,
`src/perft-bench.ts`, `src/position.ts`, every non-test file under `src/` for the sink sweep,
`AGENTS.md`, `package.json`, `tsconfig.json`, `biome.json`.

## Not produced, on purpose

No `src/` edit — **not one line**. No `## Acceptance` edit. No `plans/nfr-catalog.md` edit and no
target moved — the candidate eleventh instrument-limit correction is **named and routed, not
applied**. No edit to `ABC-023`, `ABC-009`, `ABC-010`, `ABC-011`, `ADR-0005` or `memory-bank/`. No
`UAT` cell written — that ruling is the Orchestrator's. Nobody enqueued. No `.grugops/test-skips.md`
— the integrity checker's exit 2 is recorded as an error, not cleared by a self-authored registry.
No regenerated `coverage/`. No report `.md`. No perft position added. No dependency change.

**No `finding` note** — none is admissible here: there is no §14 gate to issue a `§14-gate#<id>`
stamp and `context.human_admission` is **`off`** (re-read from `.grugops/factory.config.json` at this
hop), so no `human:<name>` stamp exists either. **Nothing is self-stamped.** No `index.md` /
`index.jsonl` — those are derived by `scripts/context-io.ts`, which does not exist in this install,
and hand-faking them would be a fabricated audit trail.
