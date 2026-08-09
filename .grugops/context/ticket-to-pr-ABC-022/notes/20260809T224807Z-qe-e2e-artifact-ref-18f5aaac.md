---
id: 20260809T224807Z-qe-e2e-artifact-ref-18f5aaac
kind: artifact-ref
by: qe-e2e
at: 2026-08-09T22:48:07Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.enpassant.hardening.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
  - plans/tickets/history/ABC-022-board-history.md
supersedes: 
---

# Artifacts produced and consumed by the `ABC-022` QE review hop

Branch `grugops/ticket-to-pr-ABC-022`. **No PR** — this repository has no git remote, so
`autonomy: pr` has always meant "branch + gate" here. **Nothing merged, nothing deployed.**

## Added in `src/` — ONE file, tests only

| file | change | note |
| --- | --- | --- |
| `src/moves.enpassant.hardening.test.ts` | **NEW**, 120 tests | every row green on the delivered fix |

**`src/moves.ts` is byte-unchanged at md5 `6335b452fc21ffe2d0f902ecab930840`**, and
`git status --short -- src/` reported exactly one untracked file before the commit. `src/legal.ts`,
`src/legal.test.ts` and `src/moves.enpassant.test.ts` were **not touched at this hop**.

## Changed in `plans/`

- `plans/board.md` — `ABC-022` moved `In Review` → `In Security/NFR`; `In Review` 1/3 → 0/3,
  `In Security/NFR` 0/2 → 1/2; the `_Updated:` header **replaced, not stacked**, per the board's own
  rule, with the replaced 2026-08-10 board-tidy header preserved **verbatim** in the ticket's history
  file. All **13** column headings re-verified against their live row counts (0 mismatches).
  `4 +/4 −`.
- `plans/tickets/ABC-022-…md` — frontmatter `status`/`column` moved with the board, and a `## QE`
  section appended (the `ABC-009` precedent). **`## Acceptance` hashes identically before and after
  (`7123d5c641045a44c6f63c2c20dab415`)**; the diff is exactly two hunks, the frontmatter pair and the
  appended section.
- `plans/tickets/history/ABC-022-board-history.md` — this hop's board entry prepended (newest first,
  the file's stated order), plus the preserved board-tidy header.
- `plans/traceability.md` — **one row edited (`ABC-022`), two cells** (`Tests`, `Status`), one
  `_Updated:` header line inserted. Table rows **32 before and after**, the `ABC-022` row at exactly
  **11 unescaped pipes** before and after, **exactly one row line changed**, and both appended strings
  asserted **pipe-free and newline-free BEFORE writing** — the edit script refuses rather than
  half-writing.

## Queue

`.grugops/queue/claimed/ticket-to-pr-ABC-022-qe/` — claim directory created by a plain atomic `mkdir`
(exit 0, so first writer), `claim.md` written, the subtask file moved in from `pending/` and on to
`done/` at the end.

## Measurement harnesses — ALL OUTSIDE THE REPOSITORY, none committed

Under the session scratchpad, **one full tree copy per state** so no two tree states share a process,
`node_modules` symlinked to the repo and the repo's own `tsconfig.json` narrowed to `src/**`:

| tree | `src/moves.ts` md5 | what it is |
| --- | --- | --- |
| `t-fix` | `6335b452fc21ffe2d0f902ecab930840` | `git archive HEAD src`, verified identical to the working tree by `diff -r` |
| `t-pristine` | `0e247853ab2c05887c76105ff83d8621` | `git archive main src` + HEAD's new test file — the RED control |
| `t-noEmpty` | `6762b334bd096f8b1d072cb68478786d` | empty-target condition deleted (byte-equal to the engineer's) |
| `t-noPawn` | `2f19080b1bf32fc1f72bd063f48ea3f3` | captured-pawn condition deleted (byte-equal to the engineer's) |
| `t-colour` | `3a5a3e2bd98e32b5c04b410a4e1c9a9b` | colour-shaped CLAUSE |
| `t-restr` | `58f154dc5f2facedf2a4a234d8c0a6fc` | colour-shaped RESTRUCTURE, drops the enemy `continue` |
| `t-white` | `caa85d206614655234833f510cd0d4e9` | captured-pawn precondition for white only |
| `t-black` | `c9aee13e50ee298d066a72766e6fdd95` | the mirror, black only |
| `t-pawnAny` | `fe7f1ce3d0cce274a99fef3c5b1bd29c` | anything non-empty behind the target |
| `t-pawnType` | `f71a289b62c1cddcb8e8162bbb05bb5c` | a PAWN of either colour behind |
| `t-wrongDir` | `7fa1933d93b658a8df23abfc6163819e` | reads `to + forward`, the wrong square |
| `t-queenOK` | `9cd6ad631ceebc5686bc164c196910aa` | "EMPTY, or the mover's own QUEEN" — **SURVIVOR** |
| `t-enemyAny` | `2685443be70632002a4e12dc0e21b653` | "some ENEMY piece is behind it" — **SURVIVOR** |
| `t-notOwnPawn` | `5bbd02ed38c1398bb194841ab4960744` | "anything but the mover's own pawn" — **SURVIVOR** |
| `t-count` | `edb14468fd5de54270c8eae85c289128` | `t-fix` + evaluation counters at the guard site |
| `t-twin` | `6335b452fc21ffe2d0f902ecab930840` | `cmp`-verified byte-identical twin of `t-fix`, the NULL CONTROL |

Probes, all written for this hop: `probe.ts` (`A1`–`A7` scored straight off the **ticket's** FEN
tables, purity on two oracles, the self-masking trace), `walkcount.ts` (the plain `legalMoves`-driven
walk carrying the `NFR-001` counters, kept in its own run), `witness.ts` (the enemy-non-pawn harm
witnesses), `quant.ts` / `quant2.ts` (both axes quantified over every piece code, kings relocated),
`gen.ts` (the candidate hardening rows, verified on all fourteen trees before one was written into a
test file), `mutate.js` (anchored single replacement asserting `count == 1` before writing and that
the file changed after), `trace-edit.js` (the traceability edit under the assertions above).
`src/perft-bench.ts` was run per tree for the throughput rounds. Every probe **prints the FEN it used
and re-parses it**, aborting if `toFen(parseFen(fen))` does not render back identically.

## Consumed

`agent-factory/roles/qe-e2e.md`, `agent-factory/workflows/16-context-read-write.md`,
`agent-factory/workflows/17-task-claim.md`, `agent-factory/contracts/context-note.md`,
`.grugops/factory.config.json`, **all thirty-nine prior notes** in
`.grugops/context/ticket-to-pr-ABC-022/notes/`, the subtask brief,
`plans/tickets/ABC-022-…md` (in full), `plans/board.md`, `plans/traceability.md`,
`plans/tickets/history/ABC-022-board-history.md`, `plans/tickets/ABC-009-…md` (the `## QE` precedent),
`src/moves.ts`, `src/legal.ts`, `src/legal.test.ts`, `src/moves.enpassant.test.ts`,
`src/moves.castling.test.ts`, `src/moves.castling.hardening.test.ts` (the hardening-file precedent),
`src/apply.ts`, `src/fen.ts`, `src/position.ts`, `src/perft.ts`, `src/perft.test.ts`,
`src/perft-bench.ts`, every comment line under `src/` for the `A11` sweep, `AGENTS.md`,
`package.json`, `tsconfig.json`, `biome.json`.

## Not produced, on purpose

No `src/moves.ts` edit — **not one line**. No `## Acceptance` edit. No edit to `ABC-023`, `ABC-009`,
`ABC-010`, `ABC-011`, `ADR-0005`, `plans/nfr-catalog.md` or `memory-bank/`. Nobody enqueued —
Security/NFR is the Orchestrator's to route. No `finding` note — none is admissible here: there is no
§14 gate to issue a `§14-gate#<id>` stamp and `context.human_admission` is **`off`** (re-read from
`.grugops/factory.config.json` at this hop), so no `human:<name>` stamp exists either. **Nothing is
self-stamped.** No `index.md` / `index.jsonl` — those are derived by `scripts/context-io.ts`, which
does not exist in this install, and hand-faking them would be a fabricated audit trail. No
`.grugops/test-skips.md`. No regenerated `coverage/` committed. No report `.md`. No perft position
added. No dependency change.
