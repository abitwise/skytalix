---
id: 20260821T190000Z-orchestrator-decision-abc-115-is-accepted-by-the-owner-and-here-is-what-that-word-does-not-buy
kind: decision
by: orchestrator
at: 2026-08-21T19:00:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ABC-116
  - ABC-117
  - AR-N8SPAWN-DRIFT
  - G-QE115-3
  - G-QE115-4
  - G-QE115-5
  - ABC-050
  - G-06
supersedes:
---

# `ABC-115` IS ACCEPTED BY THE NAMED OWNER AND MOVED TO `Done` — AND THIS NOTE EXISTS TO SAY WHAT THAT WORD DOES NOT BUY

**NOT A STAMP.** `context.human_admission` is `off`, so no `finding` is admissible on this install.
This is a hand-authored transcription of a human's word, in git, by an agent. **It is not evidence
that anything was tested.**

## The word, verbatim and attributed

> "merge grugops/cut-residual-followups, giving signature to ABC-115"
> — Olger Oeselg, project owner, in session, 2026-08-21

That sentence is the whole authority for this move. I did not infer it, and I refused to close this
ticket earlier today when the same request arrived without it.

## What was and was NOT done to earn it

- **NO UAT WAS CONDUCTED.** No pack was written, no business scenario was executed, and the UAT
  Planner never ran on this ticket. `In UAT` stayed 0/4 throughout; the ticket went `Ready for UAT`
  → `Done` directly. **Read this as ACCEPTED BY THE OWNER, never as "UAT executed and passed".**
- **The zero-production-lines waiver played no part and could not.** `src/cli.ts` shipped 13
  production lines, measured. No agent was eligible to sign this, and none did.
- What DID happen: a QE FAIL on 2026-08-21T02:35 naming two defects, a repair, and a QE
  re-verification PASS at 05:35 that closed both by the QE's own mutation rather than by reading a
  report. That is a QE result. **A green QE run is not an acceptance and must never be read as one.**

## Four merges landed on `main` the same day, at the owner's instruction. A MERGE IS NOT AN ACCEPTANCE

`9c56a6f` (`G-QE115-3`), `447713d` (`G-QE115-4`), `fcf12c1` (`G-QE115-5`), `5d719cd` (`ABC-116` and
`ABC-117` cut). Each was authorised separately and none of them accepted anything. Only the sentence
above did.

## What this signature does NOT close, listed so none of it can vanish behind a `Done`

1. **`AR-N8SPAWN-DRIFT`** — accepted risk, owner Architect/Design, discharge at `ABC-108`'s remedy.
   Open because two of `N8-SPAWN`'s three clauses are ruled non-mechanical BY DESIGN (`ADR-0017`),
   not because anyone skipped a bench fix.
2. **`ABC-116`** — the `T2` re-measure trigger has a ruling and no carrier. `Backlog`, `XS`/`P2`.
3. **`ABC-117`** — the record says that `1` is `USAGE_EXIT_CODE`; it is Node's uncaught-exception
   status. `Backlog`, `XS`/`P3`, seven sites across five files.
4. **The non-`EPIPE` → `70` routing** — sized `S`, shape forced (the arm at `src/cli.ts:159` must
   carry the outcome; `main`'s `try`/`catch` cannot reach a later-tick throw). **Needs the owner's
   word: it re-opens an accepted residual.** NOT authorised by this signature.
5. **`ABC-050`'s `exclude` residual** and **`G-06`** — both predate this entire ticket and are
   STILL UNCUT. They have now survived four sessions.

## A false sentence I left standing on purpose

`ABC-115`'s own board entry and its traceability Title cell both say `1` is the code reserved for a
refused command line. **That is wrong**, and it is exactly what `ABC-117` was cut to correct. I did
not fix it here. `ABC-117` owns those sites; author is not adjudicator, and a hop that quietly
corrects the record it is also closing leaves nobody able to see that the record was ever wrong.
It is named in the board header, in the row appendix and here, so it cannot be inherited silently.

## Board move and fences

`ABC-115` `Ready for UAT` → `Done`; `Ready for UAT` 1/4 → 0/4. No other ticket moved, nothing cut
here, no DoR re-scored, no WIP limit touched, nothing archived, `src/` untouched, `plans/nfr-catalog.md`
and `AGENTS.md` not opened for writing. **NOT DEPLOYED** — nothing is ever deployed on this install.
