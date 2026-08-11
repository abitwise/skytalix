---
id: 20260811T203019Z-orchestrator-finding-a11b2c34
kind: finding
by: orchestrator
at: 2026-08-11T20:30:19Z
verified_by: orchestrator (ran every command in this note on the rebased tip 0bef2cc)
confidence: high
refs:
  - ABC-019
  - ABC-017
  - ABC-029
  - ADR-0009
  - NFR-002
  - src/turn-loop.ts
  - src/history-pane.nfr.test.ts
  - plans/traceability.md
supersedes:
---

# The rebase is done, and it made a MERGED ticket's criterion RED — `ABC-019` is `src/history.ts`'s first production importer

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository and
> `mcp__grugops__propose_note` is unavailable, so the note kind, id and stamp were written by hand.
> Every figure below was produced by a command I ran in `../cli-chess-ABC-019` this hop. Nothing here
> is inherited from another role's report.

## 1. The rebase — done, and its integrity checked rather than assumed

`git rebase main` on `grugops/ABC-019-turn-loop-skeleton`.

- Pre-rebase tip **`10554c2`**, `main` **`9fc1c0b`**; branch was **36 behind / 8 ahead**.
- Post-rebase tip **`0bef2cc`**, **0 behind / 8 ahead**, working tree **clean** (0 porcelain lines).
- **Two conflicts, both in `plans/traceability.md`, both header-block ONLY** — commits `e7d55f7`
  (QE) and `c73f923` (Engineer). No table row conflicted; no `src/` file conflicted.

**Resolved by ROW OWNERSHIP**, the precedent this project set on `ABC-017`: both sides kept, ordered
newest-first, nothing deleted or merged by paraphrase. Verified after each resolution, not eyeballed:

| check | result |
|---|---|
| conflict markers remaining | **0** |
| table lines | **39** (`main`'s 39 — `ABC-028` and `ABC-029` rows both preserved) |
| `_Updated:` headers | **52**, none dropped |
| rows starting `\| ABC-019 ` | **1** |
| that row's naive pipe count | **12** — i.e. 13 fields, matching the escaped pipe in `EndReason \| "resignation"` that four prior hops recorded. Not a defect. |
| QE's `PASS_WITH_RISKS` text in the `ABC-019` row | present |

**The loop's own delivery is byte-identical across the rebase** — asserted before and after:

| file | md5 before | md5 after |
|---|---|---|
| `src/turn-loop.ts` | `bd793612476c9d0eac28b75e1e3297cc` | **same** |
| `src/turn-loop.test.ts` | `bb95857f638077381f84085b979bf797` | **same** |
| `src/turn-loop.nfr.test.ts` | `d48a0eb3a53a14e55972418614b8bdf2` | **same** |

## 2. Gates on the rebased tip

`npm run lint` **0** · `npm run typecheck` **0** · `npm run build` **0** · skip count **0**.

`npm test` — **RED**: **2 failed / 789 passed (791)**, **1 file failed / 27 passed (28)**.

## 3. The finding

**Both failures are in `src/history-pane.nfr.test.ts`, a MERGED file — `ABC-017`'s `A11`. Neither is
in this ticket's own tests.**

- `:228` *"leaves `src/history.ts` with ZERO runtime importers among the production modules"* →
  `expected [ 'turn-loop.ts' ] to deeply equal []`
- `:275` the module-graph load probe →
  `history.ts was evaluated in a production closure: expected [ 'apply.ts', 'moves.ts', …(14) ] to not include 'history.ts'`

**Measured cause, read at source:** `src/turn-loop.ts:52` —
`import { type GameHistory, gameStatusOf, playMove, takeBack } from "./history.ts";`

So **`ABC-019` is the first production runtime importer of `src/history.ts` in this project's
history**, and `NFR-002`'s structural premise — *zero production runtime importers* — ends at this
ticket's merge. **Both of `A11`'s instruments detect it, agreeing with each other.** That premise had
been re-derived four times and each of those derivations was correct on the tree it was run against;
what changed is the tree.

**This is not a code defect and I am not routing it as one.** The loop importing the game history is
what `ABC-019`'s scope and `ADR-0002` require. It is a criterion collision, and criteria are BA/PM's.

**It is also `ABC-029`'s question arriving early and from the other side.** `ABC-029` was cut for
*"production module" is undefined* with a dated trigger of `EPIC-006`; the trigger has fired now,
by a path nobody predicted — a new production module rather than an undefined old one.

## 4. `ADR-0009` cl. 9f is NOT discharged, and I am not claiming it is

The rebase only made the real-panel run **possible**. Both panels are on this tip — I read
`STATUS_ROWS = 3` at `src/status-panel.ts:71` and `HISTORY_ROWS = 8` at `src/history-pane.ts:70`, so
the real pair is **3/8**, exactly what `[D51]` measured assembles to `H` = 23 (in-place). `[D51]`'s
ruling therefore applies unchanged: the real-panel run **ADDS** to `A18`'s two stub shapes and never
replaces them. **No real-panel run has been written or run. The loop's tests still drive stubs.**

## 5. The lane — one reading, on a RED suite, and NOT a verdict

`/usr/bin/time -p npm test`: **2.34 s wall, 9.95 s CPU** (user 8.53 + sys 1.42) against `ADR-0008`'s
**≤ 3 s wall / ≤ 13 s CPU**.

**This is one run of a failing suite, not `ADR-0008`'s protocol** (medians of ≥ 7 interleaved runs).
It is recorded as a signal and must not be quoted as MET: at ~78% of the wall clause and ~77% of the
CPU clause it is materially tighter than the 52–59% the catalog records for `main`, and `A20` plus the
cl. 9f run are still unwritten. **`N8-LANE` is owed a real re-measurement by the dev hop, after
green.**

## 6. Queue sweep (Workflow 17 step 6)

Three stale records cleared, all confirmed complete before touching them:

- `claimed/refinement-ABC-019-d27/` and `claimed/ticket-to-pr-ABC-019-a10b/` were **orphan claim
  records** — both subtask files were already in `done/`, so nothing was returned to `pending/`; only
  the claim directories were released. Stamps `2026-08-12T06:30:00Z` and `2026-08-11T21:30:00Z`,
  both far past `queue.stale_ttl_minutes` = 30.
- `pending/quality-gate-ABC-027-qe.md` → `done/`; `ABC-027` merged 2026-08-12.

`claimed/` and `pending/` were both empty afterwards, before this hop's enqueue.

## 7. A record defect, flagged and NOT smoothed

This machine's clock reads **2026-08-11T20:30:19Z** (local 23:30, and vitest independently printed
`Start at 23:27:05`). The board, the traceability headers and `ABC-017`'s merge record are all dated
**2026-08-12**. I used the true clock in this hop's files rather than matching the record, and I
edited nothing to make the two agree. **Someone's dates are ahead of this machine by about a day.**

## 8. What I did NOT do

No `src/` byte written. `plans/tickets/`, `plans/nfr-catalog.md`, `memory-bank/50-decisions/` and
`ABC-017`/`ABC-029` untouched. Nothing merged, nothing pushed, nothing deployed — a human holds
merge and deploy.
