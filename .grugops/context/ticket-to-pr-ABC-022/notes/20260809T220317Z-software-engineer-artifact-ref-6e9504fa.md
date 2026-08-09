---
id: 20260809T220317Z-software-engineer-artifact-ref-6e9504fa
kind: artifact-ref
by: software-engineer
at: 2026-08-09T22:03:17Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.enpassant.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Artifacts produced and consumed by the `ABC-022` site-7 hop (third engineer hop)

Branch `grugops/ticket-to-pr-ABC-022`. **No PR** — this repository has no git remote, so `autonomy:
pr` has always meant "branch + gate" here. **Nothing merged, nothing deployed. No board move, and
nobody enqueued.**

## Changed in `src/` — ONE file, comment text only

| file | change | md5 before → after |
| --- | --- | --- |
| `src/moves.enpassant.test.ts` | `+23 −14`, comment-only, `A11` site 7 plus two further sites in the same file | `825d079d8508ec01832e3b553b706e16` → `90b45c567cafadd620599b7acaf5bec1` |

`git status --short -- src/` reports exactly ` M src/moves.enpassant.test.ts`. Byte-unchanged and not
revisited: **`src/moves.ts` `6335b452fc21ffe2d0f902ecab930840`** (the hash this hop had to hold),
`src/legal.ts` `7be9fc8c1c313bdbc4c582040965c2eb`, `src/legal.test.ts`
`72fa550c347510c506f174693358314a`.

## Changed in `plans/`

- `plans/tickets/ABC-022-…md` — **appended only**. The diff is a **single `@@ -1004,0 +1005,113 @@`
  hunk**: one `###` subsection under the existing `## Implementation`, inserted before
  `## Board history`. Verified mechanically rather than by eye: **`## Acceptance` hashes identically
  before and after (`7123d5c641045a44c6f63c2c20dab415`)**, and the frontmatter is byte-identical, so
  `status` / `column` did not move. **`A11` was not edited, not reduced and not re-pinned.**
- `plans/traceability.md` — **one row edited (`ABC-022`), three cells** (`Code (PR/files)`, `Tests`,
  `Status`), one `_Updated:` header line inserted at index 1. Table rows **31 before and after**, the
  `ABC-022` row at exactly **11 unescaped pipes** before and after, **exactly one row line changed**,
  and every appended string asserted **pipe-free and newline-free BEFORE writing** — the edit script
  refuses rather than half-writes.

## Not changed

`plans/board.md` — not edited, no column moved, no WIP number changed. `src/moves.castling.test.ts`
— **flagged, not edited** (see the `observation` at `22:03:15Z`). `ADR-0005`, `ABC-011`, `ABC-023`,
`ABC-010`, `ABC-013`, `plans/nfr-catalog.md`, `memory-bank/` — untouched, all fenced by `A11` and
named as other roles'. `ABC-023`'s stale `A4` hash pin is **still stale and still deferred by
design**; nothing here re-pinned or re-noted it. `package.json` / `package-lock.json` untouched.

## Queue

`.grugops/queue/claimed/ticket-to-pr-ABC-022-dev3/` — claim directory created by a plain atomic
`mkdir` (exit 0, so first writer), `claim.md` written, the subtask file moved in from `pending/` and
on to `done/` at the end.

## Measurement harnesses — ALL OUTSIDE THE REPOSITORY, none committed

Under the session scratchpad, one full tree copy per state with `node_modules` symlinked to the repo
and `tsconfig.json` narrowed to `src/**`: `t-pristine` (`git archive main src`), `t-fix`
(`git archive HEAD src`, verified identical to the working tree by a recursive `diff --brief`),
`t-fix-noEmpty` (`6762b334bd096f8b1d072cb68478786d`) and `t-fix-noPawn`
(`2f19080b1bf32fc1f72bd063f48ea3f3`), both **byte-equal to hop one's mutants**. `probe.ts` scores
every row of the file's four tables plus the two controls for generator ep count, `legalMoves` ep
count, across-call purity and per-make/unmake-pair purity, and traces the self-masking row and the
half-(b) restore byte by byte; it **prints each FEN and re-parses it, aborting if it does not render
back identically**. `trace2.ts` orders the self-masking pass move by move. `castling-flag.ts` scores
the three `src/moves.castling.test.ts` FENs behind the flagged sixth site. `mutate.js` performs an
anchored single edit that asserts `count == 1` before writing and asserts the file changed after;
`trace-edit.js` makes the traceability edit under the assertions listed above. `tsc --noEmit` exit 0
on all four trees before any result was believed.

## Consumed

`agent-factory/roles/software-engineer.md`, `agent-factory/workflows/16-context-read-write.md`,
`agent-factory/workflows/17-task-claim.md`, `agent-factory/contracts/context-note.md`,
`.grugops/factory.config.json`, **all thirty prior notes** in
`.grugops/context/ticket-to-pr-ABC-022/notes/`, the subtask brief,
`plans/tickets/ABC-022-…md` (`## Acceptance` in full, `## Implementation`), `plans/traceability.md`,
`src/moves.enpassant.test.ts`, `src/moves.ts`, `src/legal.ts`, `src/legal.test.ts`, `src/apply.ts`,
`src/position.ts`, `src/moves.castling.test.ts`, every comment line under `src/` for the sweep,
`AGENTS.md`, `tsconfig.json`.

## Not produced, on purpose

No `finding` note — none is admissible here: there is no §14 gate to issue a `§14-gate#<id>` stamp
and `context.human_admission` is **`off`** (re-read from `.grugops/factory.config.json` at this hop),
so no `human:<name>` stamp exists either. **Nothing is self-stamped.** No `index.md` / `index.jsonl`
— those are derived by `scripts/context-io.ts`, which does not exist in this install, and hand-faking
them would be a fabricated audit trail. No `.grugops/test-skips.md`. No report `.md`. No new test
file and no test row.
