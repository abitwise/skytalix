---
id: 20260809T213848Z-software-engineer-artifact-ref-4f3bac59
kind: artifact-ref
by: software-engineer
at: 2026-08-09T21:38:48Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/legal.ts
  - src/legal.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Artifacts produced and consumed by the `ABC-022` `A11`-apply hop (second engineer hop)

Branch `grugops/ticket-to-pr-ABC-022`. **No PR** — this repository has no git remote, so `autonomy:
pr` has always meant "branch + gate" here. **Nothing merged, nothing deployed. No board move, and
nobody enqueued.**

## Changed in `src/` (two files, comment text only)

| file | change | md5 before → after |
| --- | --- | --- |
| `src/legal.ts` | `+9 −4`, comment-only, `A11` site 3 (paragraph 68-72 → 68-77) | `aa645c6964ed902489425150e3879fd8` → `7be9fc8c1c313bdbc4c582040965c2eb` |
| `src/legal.test.ts` | `+13 −8`, comment-only, `A11` sites 4-6 | `424cbd57dde9232749eb9247f5e627b5` → `72fa550c347510c506f174693358314a` |

**`src/moves.ts` is byte-unchanged at `6335b452fc21ffe2d0f902ecab930840`**, as this hop required.
`src/moves.enpassant.test.ts` is byte-unchanged at `825d079d8508ec01832e3b553b706e16` — site 7 was
not applied; see the `decision` note published at `2026-08-09T21:38:43Z`. `git status --short -- src/`
reports exactly ` M src/legal.test.ts` and ` M src/legal.ts`.

## Changed in `plans/`

- `plans/traceability.md` — **one row edited (`ABC-022`), three cells** (`Code (PR/files)`, `Tests`,
  `Status`), one `_Updated:` header line inserted. Row count **32 before and after**, the `ABC-022`
  row at exactly **11** unescaped pipes before and after, every added string asserted pipe-free and
  newline-free **before** writing — the edit script refuses rather than half-writes.
- `plans/tickets/ABC-022-…md` — **appended only**, one hunk at line 932: two `###` subsections under
  the existing `## Implementation`. Verified mechanically: the diff is a single `@@ -932,0 +933 @@`
  hunk, the `## Acceptance` section hashes **identically** to `HEAD` (`7123d5c641045a44c6f63c2c20dab415`
  before and after), and the frontmatter is untouched, so `status` / `column` did not move.

## Not changed

`plans/board.md` — not edited, no column moved, no WIP number changed. `ADR-0005`, `ABC-011`,
`ABC-023`, `ABC-010`, `ABC-013`, `plans/nfr-catalog.md`, `memory-bank/` — untouched, all fenced by
`A11` and named as other roles'. `ABC-023`'s stale `A4` hash pin is **still stale and still deferred
by design**; nothing here re-pinned or re-noted it. `package.json` / `package-lock.json` untouched.

## Queue

`.grugops/queue/claimed/ticket-to-pr-ABC-022-dev2/` — claim directory created by a plain atomic
`mkdir` (exit 0, so first writer), `claim.md` written, the subtask file moved in from `pending/` and
on to `done/` at the end.

## Measurement harnesses — ALL OUTSIDE THE REPOSITORY, none committed

Under the session scratchpad, one full tree copy per state with `node_modules` symlinked to the repo
and `tsconfig.json` narrowed to `src/**`: `t-pristine` (`git archive main src`), `t-fix`
(`git archive HEAD src`, verified identical to the working tree by a recursive `diff --brief`), and
`t-fix-noA` (guard (a) deleted from the fixed tree, `src/legal.ts` md5 `450cd8cd839a0d3514395512c743e05c`).
The deletion was an **anchored single edit** that asserted `count == 1` before writing and asserted
the file changed after; it refuses on any other count. One probe, `probe-rows.ts`, scores the two
`src/legal.test.ts` tables plus two in-domain controls for generator ep count, oracle,
`hasLegalEnPassant`, and purity of both across the call — each FEN printed and **re-parsed** before a
verdict. `tsc --noEmit` exit 0 on all three trees before any result was believed. One node script,
`trace-edit.js`, made the traceability edit under the assertions listed above.

## Consumed

`agent-factory/roles/software-engineer.md`, `agent-factory/workflows/16-context-read-write.md`,
`agent-factory/workflows/17-task-claim.md`, `agent-factory/contracts/context-note.md`,
`.grugops/factory.config.json`, **all twenty-two prior notes** in
`.grugops/context/ticket-to-pr-ABC-022/notes/`, the subtask brief,
`plans/tickets/ABC-022-…md` (`## Acceptance` in full, `## Implementation`),
`plans/traceability.md`, `src/legal.ts`, `src/legal.test.ts`, `src/moves.ts`,
`src/moves.enpassant.test.ts`, `src/zobrist.ts`, `AGENTS.md`, `tsconfig.json`, `biome.json`.

## Not produced, on purpose

No `finding` note — none is admissible here: there is no §14 gate to issue a `§14-gate#<id>` stamp
and `context.human_admission` is `off` (re-read from `.grugops/factory.config.json` at this hop), so
no `human:<name>` stamp exists either. **Nothing is self-stamped.** No `index.md` / `index.jsonl` —
those are derived by `scripts/context-io.ts`, which does not exist in this install, and hand-faking
them would be a fabricated audit trail. No `.grugops/test-skips.md`. No report `.md`. No new test
file and no test row — a comment-only hop adds neither.
