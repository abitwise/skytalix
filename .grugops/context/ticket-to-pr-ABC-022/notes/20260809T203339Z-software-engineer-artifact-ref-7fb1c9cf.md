---
id: 20260809T203339Z-software-engineer-artifact-ref-7fb1c9cf
kind: artifact-ref
by: software-engineer
at: 2026-08-09T20:33:39Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.ts
  - src/legal.ts
  - src/moves.enpassant.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Artifacts produced and consumed by the `ABC-022` implementation hop

Branch `grugops/ticket-to-pr-ABC-022`. **No PR** — this repository has no git remote, so `autonomy:
pr` has always meant "branch + gate" here. **Nothing merged, nothing deployed.**

## Changed in `src/` (three files)

| file | change | md5 after |
| --- | --- | --- |
| `src/moves.ts` | `+24 −12` — two preconditions and one local `const` in the en-passant branch of `addPawnMoves`, plus the 183-186 comment rewritten for `A11` | `6335b452fc21ffe2d0f902ecab930840` (was `0e247853ab2c05887c76105ff83d8621`) |
| `src/legal.ts` | `+6 −2`, **comment-only**, `A11` second half: 102-103 corrected, **104-105 byte-for-byte** | `aa645c6964ed902489425150e3879fd8` |
| `src/moves.enpassant.test.ts` | **NEW**, 208 lines, 58 tests | — |

`git diff --name-only main -- 'src/*.test.ts'` is **empty**. **`src/moves.ts`'s new hash invalidates
`ABC-023`'s `A4` pin** exactly as recorded at the pull; that is deferred by design to `ABC-023`'s own
promotion hop and was **not re-pinned and not re-noted** on that ticket.

## Changed in `plans/`

- `plans/board.md` — `In Development` 1/3 → 0/3, `In Review` 0/3 → 1/3, the `ABC-022` line item
  moved, an exit comment and an entry comment added, one `_Updated:` header line inserted. All
  **10** numeric column headers re-verified against their line-item counts (0 wrong).
- `plans/traceability.md` — **one row edited (`ABC-022`), four cells** (`NFRs`, `Code (PR/files)`,
  `Tests`, `Status`); row count identical before and after, the row asserted at exactly **11**
  unescaped pipes before and after, every added string asserted pipe-free and newline-free **before**
  writing. One `_Updated:` header line inserted.
- `plans/tickets/ABC-022-…md` — frontmatter `status`/`column` moved with the board, and an
  `## Implementation` section appended (the `ABC-009` / `ABC-018` precedent). **Nothing above that
  section was edited.**

## Queue

`.grugops/queue/claimed/ticket-to-pr-ABC-022-dev/` — claim directory created by a plain atomic
`mkdir` (exit 0, so first writer), `claim.md` written, the subtask file moved in from `pending/` and
on to `done/` at the end.

## Measurement harnesses — ALL OUTSIDE THE REPOSITORY, none committed

Under the session scratchpad, **one full tree copy per state** so no two tree states share a process,
each with `node_modules` symlinked to the repo and `tsconfig.json` narrowed to `src/**`:

| tree | `src/moves.ts` md5 | what it is |
| --- | --- | --- |
| `t-pristine` | `0e247853ab2c05887c76105ff83d8621` | `HEAD`'s `moves.ts` + the new test file — the RED control |
| `t-fix` | `6335b452fc21ffe2d0f902ecab930840` | the branch tip, byte-compared against it |
| `t-noempty` | `6762b334bd096f8b1d072cb68478786d` | empty-target condition deleted |
| `t-nopawn` | `2f19080b1bf32fc1f72bd063f48ea3f3` | captured-pawn condition deleted |
| `t-restr` | `dd5b7ab68fe2a7f2a1ec2cd80740c251` | colour-shaped restructure, drops the enemy `continue` |
| `t-count` | `9daad92c846d7f7a625a15f445805ab0` | `t-fix` + evaluation counters at the guard site |
| `t-twin` | `6335b452fc21ffe2d0f902ecab930840` | `cmp`-verified byte-identical twin of `t-fix`, the NULL CONTROL |

Probes: `mutate.js` (anchored single replacement, asserts `count == 1` and that the file changed),
`walk.ts` (the `A7` before/after walk plus the ep-onto-occupied probe), `walkcount.ts` (the plain
`legalMoves`-driven walk carrying the `NFR-001` counters), and `src/perft-bench.ts` run per tree for
the throughput rounds. Roots and `fast` depths are **parsed out of `src/perft.test.ts`** by the
harness, which exits non-zero unless it finds exactly six. Every probe **prints the FEN it used and
re-parses it** before taking a verdict.

## Consumed

`agent-factory/roles/software-engineer.md`, `agent-factory/workflows/16-context-read-write.md`,
`agent-factory/workflows/17-task-claim.md`, `agent-factory/contracts/context-note.md`,
`.grugops/factory.config.json`, all seven prior notes in
`.grugops/context/ticket-to-pr-ABC-022/notes/`, `plans/board.md`, `plans/traceability.md`,
`plans/tickets/ABC-022-…md`, `plans/tickets/ABC-009-…md` (the `## Implementation` precedent),
`src/moves.ts`, `src/legal.ts`, `src/position.ts`, `src/apply.ts`, `src/perft.ts`,
`src/perft.test.ts`, `src/perft-bench.ts`, `src/moves.castling.test.ts`, `AGENTS.md`,
`package.json`, `tsconfig.json`, `biome.json`.

## Not produced, on purpose

No `finding` note — none is admissible here: there is no §14 gate to issue a `§14-gate#<id>` stamp
and `context.human_admission` is `off`, so no `human:<name>` stamp exists either. No `index.md` /
`index.jsonl` — those are derived by `scripts/context-io.ts`, which does not exist in this install,
and hand-faking them would be a fabricated audit trail. No `.grugops/test-skips.md` — the integrity
checker's exit 2 is recorded as an error, not cleared by a self-authored registry. No perft position
added. No report `.md`. No dependency change.
