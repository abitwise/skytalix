---
id: 20261011T200744Z-ba-pm-decision-recut-abc152-owner-route-1fb50f49
kind: decision
by: ba-pm
at: 2026-10-11T20:07:44Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - ADR-0041
  - ADR-0035
  - ABC-149
  - ABC-151
  - ABC-094
  - ABC-013
  - QE-151-a
  - QE-151-b
  - QE-149-a
  - QE-149-c
  - QE-144-a
  - RISK-ABC143-01
  - RISK-ABC144-FCAP
  - RISK-ABC152-NEGWORKERS
  - RISK-ABC152-A2-GRAPH
  - NFR-008
  - plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
  - .grugops/context/wave-2026-09-25/notes/20261011T194129Z-orchestrator-decision-owner-word-abc151-keep-k2-abc152-runner-off-one-ticket-06bfc2d7.md
  - .grugops/context/design-ABC-152-owner-route/notes/20261011T195931Z-architect-design-decision-abc152-owner-route-adr0042-addendum-f9b73048.md
  - .grugops/context/design-ABC-152-owner-route/notes/20261011T195931Z-architect-design-observation-abc152-owner-route-handoff-recut-build-plan-80a214d3.md
  - .grugops/context/wave-2026-09-25/notes/20261011T200637Z-orchestrator-decision-owner-word-accept-adr0042-a2-graph-c9b52bb2.md
supersedes:
  - .grugops/context/bapm-cut-k2-vitest41/notes/20261011T161509Z-ba-pm-decision-cut-abc151-k2-abc152-vitest41-b7e2a9c4.md
---

# BA/PM: `ABC-152` re-cut to the owner's route (`ADR-0042` addendum). `L` (upper edge), `P1`, DoR 10/10

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). It supersedes
`…b7e2a9c4` **for `ABC-152` only**: decisions 5, 6, 8 and 12 there are replaced. Its `ABC-151` decisions stand.
- **Branch:** `grugops/bapm-recut-ABC-152`, from `main` `2b23186b`. Not merged.
- **Nothing was measured.** Every figure comes from `ADR-0042`, its addendum, or notes `…0ec854fb` and `…43a9c855`.
- **Edited:** the ticket page and one appended trace row. **Not edited:** `plans/board.md` (by instruction),
  `src/`, `AGENTS.md`, ADRs, and `package.json`.

## The Architect's ten items, applied

| # | item | where on the page |
|---|---|---|
| 1 | header and § Scope: the owner's word replaces the spy-form-only reading; scope = R1–R5, A20, A2; `D4` answered | banner; § Scope 1–2 |
| 2 | § Out of scope: "beyond the addendum's admitted forms"; `src/` stays out | § Out of scope (plus a sixth form and `nodeLoader`, both from the addendum) |
| 3 | `V4`: the set, ruling 1's armed rule, expected-0 → add the call, `glyph-mode.nfr` ×3 modules, A2 red at head + blind under the old form | `V4` |
| 4 | `V5`: the admitted content; `expect(` equal except `cli.test.ts` +3; tests base + 1; files base; skips 0 | `V5` (56 / 1741 / 0) |
| 5 | `V6`: `VITEST_MAX_WORKERS` 1 ≤ n ≤ 2; the 3.x pair dropped; the reds and greens; fold `QE-151-a`/`-b`; `QE-144-a` closes | `V6`. The reds are ruling 4's full list of 11, which is wider than the hand-off's 9 |
| 6 | `V2`: the awaited plant; six rows by content, including the exit-code-only row; `M9b`; the `QE-149-a` join | `V2` |
| 7 | `V9`–`V11`: base = merge-base on `main`; own `npm ci`; no symlink; `lane144b.mjs` behind step 0; cooled if > 9.0 s; the bar unchanged | `V9`–`V11` |
| 8 | § Dependencies: 149/151 merged; no floor `F` carries over; `RISK-ABC144-FCAP` closes pre-merge | § Dependencies |
| 9 | residuals `RISK-ABC152-NEGWORKERS`, `RISK-ABC152-A2-GRAPH` | new § Risks table |
| 10 | size | § Size: `L` at the upper edge |

## Decisions beyond the list (each a reading, named so it can be overruled)

| # | decision | why |
|---|---|---|
| 1 | **`V1` names the three ranges** (`~4.1.11` ×2, `vite ~7.3.6`), and `npm ls` adds `vite` | The addendum says `V1` is unchanged. The first cut's `V1` pointed at "`D1`'s patch", and `D1` now names a direct `vite` devDependency, which is a new entry in `package.json`. This writes `D1` in rather than changing the criterion |
| 2 | **`V3` states its two reds** (key deleted, key `true`) | That is ruling 4's literal. The first cut said "red when the key is removed" |
| 3 | **`V10`: the cooled state, when owed, is held to the same W** (median + R ≤ 10 s) | The addendum says the cooled state is "owed" but gives no bar for it. `ABC-151` `A3` held both states to W. **The Architect or the Orchestrator may correct this reading** |
| 4 | **`D1`–`D4` are collapsed to a pointer** (the ADR and the first cut, `59f78226`) | They are met. Process rule 2 sends the narration to the notes and the ADR |
| 5 | **`L`, not `XL`, and not split** | The design risk is retired: every form, the pin, the reporter, A20 and A2 has a run prototype. There are 0 production lines, and ruling 7's stop rule bounds the one unknown. The owner said "one ticket", and neither half has value alone |
| 6 | **The page is 306 lines** (254 before) | Rule 2's control is a median over ten tickets, not a cap per page. The test rework and plants the owner added are acceptance and must stay on the page |

## DoR: 10 of 10

Item 10 holds. While this hop was running, the owner accepted `ADR-0042` with its addendum, and
`RISK-ABC152-A2-GRAPH` (`…c9b52bb2`, `main` `74674c91`), so no merge hold remains. The page carries this. The
ruling-7 count is 0, which stays `UNKNOWN - verify` until `V4`.

## The owner's (via the Orchestrator)

- ~~Acceptance of `ADR-0042`~~ and ~~ruling 3's narrowing (`RISK-ABC152-A2-GRAPH`)~~: **both accepted**
  (`…c9b52bb2`).
- `V9` outside the merge band.
- Any ruling-7 case the build's `V4` finds.

## Board (for the Orchestrator)

- `ABC-152`: `In Design` → `Ready for Dev`. Under process rule 1, the criteria are re-read at that exit.
