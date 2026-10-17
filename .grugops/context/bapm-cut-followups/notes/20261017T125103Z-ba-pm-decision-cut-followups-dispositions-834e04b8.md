---
id: 20261017T125103Z-ba-pm-decision-cut-followups-dispositions-834e04b8
kind: decision
by: ba-pm
task: bapm-cut-followups
at: 2026-10-17T12:51:03Z
verified_by:
confidence: high
refs:
  - ABC-157
  - ABC-158
  - ABC-159
  - ABC-160
  - ABC-161
  - ABC-162
  - ABC-163
  - ABC-164
  - ABC-165
  - ABC-146
  - ADR-0038
  - ADR-0043
  - 20261017T125103Z-ba-pm-observation-cut-followups-readings-85e8dfdd
  - 20261012T124017Z-orchestrator-decision-owner-word-2026-10-12-backlog-rescore-19019ec0
supersedes:
---

# Fifteen follow-ups: nine tickets cut (`ABC-157`–`ABC-165`), `ABC-146` amended (and item 13 folded into it), the rest closed with reasons

Hand-authored and unsealed (no `finding` is admissible on this install). Owner word: "cut tickets for the open
follow-ups". Every reading is in `…85e8dfdd`, taken at `main` `1671f24f`. Every new ticket is DoR **10/10**, front
matter `Backlog`. The column moves are the Orchestrator's; the recommendation for each is `Backlog → Ready` (the
`Ready` column read 0/8 at `1671f24f`).

## Tickets cut

| id | from | title (short) | size | prio | builder | pull order |
|---|---|---|---|---|---|---|
| `ABC-157` | 1 `QE-024-a` | castling right test can be weakened to read any right | `XS` | `P2` | SE | any |
| `ABC-158` | 2 `QE-056-a` + 3 `QE-056-b` | `AR-1`'s checks miss four import forms and two legs of the reason | `XS` | `P3` | Release Manager | any |
| `ABC-159` | 4 `QE-030-a` | four nfr-test headers carry a disagreeing running tally | `XS` | `P3` | SE | after `ABC-096` (shares `src/history-pane.nfr.test.ts`) |
| `ABC-160` | 5 `QE-155-a` | book sha256 test lacks a first-char near-miss | `XS` | `P3` | SE | any |
| `ABC-161` | 6 `QE-101-a`, `SEC-101-a`, `QE-101-b` | three `src/cli.test.ts` rows a wrong difficulty build passes | `XS` | `P3` | SE | after `ABC-096` (shares `src/cli.test.ts`) |
| `ABC-162` | 7 `AR-095-CWD` | `A7`'s real-engine child runs from the tree root | `XS` | `P3` | SE | any |
| `ABC-163` | 8 `AR-095-L1UNIT` | fold Ruling 2 into `clause-b.mjs` | `S` | `P3` | Architect/Design | any |
| `ABC-164` | 10 `AGENTS.md` | 0 B headroom and two stale test receipts | `XS` | `P3` | AGENTS.md Scribe | after `ABC-096` (receipts read once on its tree) |
| `ABC-165` | 11 `QE-156-a` + 12 `QE-040-c` | trace rows that do not render as ten columns; metrics header | `S` | `P3` | Orchestrator routes (SE) | any; run at the tip |

**Bundles.** 2+3 share one record (`AR-1`) and one owner. 6 shares one file (`src/cli.test.ts`) and one builder.
11+12 share an owner but not a file; one hop is cheaper than two, and that is the only reason.

**Found wider than recorded, folded into the cut, not new scope:**
- `ABC-159`: four sites, not two. Three of them count the same thing and disagree (3, 5, 6th).
- `ABC-161`: the `--colour` value list is blind the same way (`P9e`, 78/78), because `black` also occurs in the
  slot's example.
- `ABC-165`: ten malformed rows, not five; three of them were appended on 2026-10-17.

## `ABC-146` amended (item 14), and item 13 folded into it

- **New `A0`:** a pre-registered paired factor reading (`chooseMove` workload of `…70684a78`, 5 interleaved pairs,
  equal node counts or void, width 1, Security/NFR takes it). **Route rule: route V (vitest, no new code) when 10 h ×
  `F_hi` ≤ 13 h, so `F_hi` ≤ 1.30; otherwise route N (plain `node`, the page as written).**
- Route V cancels `A1`–`A4` and Scope 1–4, keeps `A5` with the vitest command (run directly, never through
  `npm test`), and fences `A6` to 0 changed lines outside records. A crash before 180/180 goes to the owner.
- **New `A7` (item 13):** before any verdict number is quoted, `ADR-0038`'s `:196`/`:235` headings stop saying
  PROPOSED, and on route V a dated second addendum names the vitest run. Architect/Design owns it. This is smaller
  than a ticket of its own, and the ADR has to change on route V anyway.
- **Re-score 8/10 → 10/10.** `XS`, `P1` unchanged. Recommended `Backlog → Ready`.
- **Reading stated:** "fits the 7–13 h band" is read as the band's upper end against the worst pair (`F_hi`). It is
  the owner's to restate before `A0` runs (owner question 1 below).

## Closed with no ticket

| item | id | reason |
|---|---|---|
| 6 | `QE2-101-a` (INFO) | a calibration candidate for `N8-LANE` (`src/render.test.ts`'s first 4.1 twin reading). No state moves under it. It stays in `qe2-ABC-101/notes/…4da1976a` for the Architect's next calibration |
| 6 | `QE2-101-b` (INFO) | the waiver filter treats `src/__snapshots__/*.snap` as production. It **fails safe**: UAT is asked for, never skipped. The rule is the owner's (owner question 2, optional) |
| 8 | `AR-095-READ` | accepted residual, trigger not fired: `package.json` is `private` with no `bin`, and the read path is a constant module-relative URL |
| 9 | `QE-095-b` (LOW) | covered by composition: P2 reds `book-engine.test.ts` `A1` and `A4` at `1671f24f`. QE ruled `A7` sufficient as written; a fixture book would be new scope |
| 9 | `QE-095-c` (LOW) | covered by composition: P7 reds 6 default-lane rows at `1671f24f`, and `ABC-094` `A5` pins "warn exactly once" at unit level. A second engine ply would add ~3 s to `CLI_DEEP` for a regression already caught |
| 9 | `QE-095-d` (LOW) | accepted residual: a leftover copy is tmp-only, same-user, outside the repository (Security/NFR agreed LOW). The delivered removal is correct: 0 leftovers after three `CLI_DEEP` runs here |
| 9 | `QE-095-e` (LOW) | the rule is right where it is read: `ADR-0037:41` and `src/cli.real-engine.test.ts:112-130`. The wrong wording is on two `Done` pages (`ABC-095:260`, `ABC-119:407`), which no build reads; Security/NFR's corrected text is in `…b65b11b7` |
| 9 | `QE-095-i` (INFO) | a forward-only protocol question for the Architect (does an idle process void a round). It did not bear on the re-read (`qe-n8-ABC-095/notes/…15521bc7`) |
| 9 | `QE-095-k`, `QE-095-l` (INFO) | the Architect's rollback watch and calibration data. No state moves under either; recorded in `…15521bc7` |
| 15 | `ADR-0043` code points vs code units (INFO) | no defect: the artifact holds 0 astral code points, so both units cut every shipped family the same, and `ABC-096` `A4` pins the astral case. The Architect may add a clarifying line when `ADR-0043` is next touched |

## Owner questions (none blocks a cut)

1. **`ABC-146` route rule:** *"For 'fits the 7–13 h band', should the in-vitest projection use the worst of the five
   paired readings (stricter: vitest only if 10 h × worst ≤ 13 h), or their median?"* The page uses the worst, and the
   reading runs on that rule unless you say otherwise before it is taken.
2. **Optional, `QE2-101-b`:** *"Should a ticket whose only `src/` change outside `*.test.ts` is a regenerated
   `src/__snapshots__/*.snap` file keep the zero-production-lines UAT waiver?"* Today it does not; that fails safe.

## For the Orchestrator

- Three of today's appended trace rows (`ABC-030 (QE)`, `ABC-024 (QE)`, `ABC-156 (QE)`) split into 11 cells. The
  `ABC-165` `A1` command, run before an append, would catch that. The nine rows this hop appended split into 10.
- This hop did not touch `plans/board.md`, `AGENTS.md`, `src/` or the `ABC-096` page.
