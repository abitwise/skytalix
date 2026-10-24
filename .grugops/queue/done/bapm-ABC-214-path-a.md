---
subtask: bapm-ABC-214-path-a
role: ba-pm
ticket: plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md
ref: .grugops/context/bapm-ABC-214-path-a/
branch: new records branch grugops/bapm-ABC-214-path-a, CUT FROM main (d4d49c5a), worktree ../wt-bapm-ABC-214-path-a
width: 1 of 3
---

# ABC-214: the owner chose path A

## Do
- The one-line amendment the page promises: delete every [B] row, keep [both] and [A]; record the owner word. Re-check Definition of Ready; if 10/10, status/column -> Ready.
- Cut the later re-derive ticket the page's item 8 describes (Backlog, EPIC-008), now that the owner's word exists. It removes the NOTICE carve-out once our own values ship and is measured by the EPIC-008 harness like any change.
- Records only; `git diff --stat d4d49c5a..HEAD -- src tools package.json` must print nothing (paste it).

## Fences
- Only your worktree. The licence ADR is the Architect's (in flight now); don't write it. Don't touch plans/board.md or the held security branch; no homelab detail. Never push, force, amend or rebase; never merge into main.

## Publish
- Seal notes (task bapm-ABC-214-path-a). ## Result into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done 2026-10-24 by BA/PM.** Branch `grugops/bapm-ABC-214-path-a` @ `5f0e21ef` (worktree `../wt-bapm-ABC-214-path-a`,
from `main` `d4d49c5a`). Records only. Not merged, not pushed. Notes (`bapm-ABC-214-path-a`): observation
`20261024T080343Z-ba-pm-observation-b8af3e18`, decision `20261024T080345Z-ba-pm-decision-c8dc129c`. Both seals read
back `ok`.

`git diff --stat d4d49c5a..HEAD -- src tools package.json` prints nothing. Files: the ABC-214 page, the new ABC-215
page, EPIC-008 and the two notes.

- **`ABC-214` amended to path A** (owner word `…fb0468ff`).
  - Every [B] row is deleted, and [both] and [A] are unchanged. `A7` was path B's, and its number is retired.
  - Readings re-read at `d4d49c5a`: no change from `c487d89c` on any file read, so `A5`'s base check holds.
  - **Pre-read for `A5`'s stop:** `ABC-205` as built (`4f650a45`) keeps `KING_TABLE` as the middlegame half, and its
    `KING_ENDGAME_TABLE` is our own. If it merges as built, the carve-out list stays the seven names.
  - **DoR 10/10. Page status: `ready`, column `Ready`** (Ready 0/8 → 1/8). The board move is the Orchestrator's.
- **`ABC-215` cut** (`EPIC-008`, Backlog, `L`, `P2`, DoR 9/10, held by sequence). Page:
  `plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md`.
  - It replaces every array that `ABC-214`'s carve-out names at its base. Each array is made by a rule stated in its
    comment, and a test rebuilds it.
  - In the same change it removes the `NOTICE` CC BY-SA section, `ABC-214`'s two header lines and the Michniewski
    credit.
  - **Ready trigger:** `ABC-214` merged, `ABC-205` Done or closed, and `ABC-204` Done.
- **New ship rule S3** (`ABC-215` only, written on the epic too): D not LOSS. A NEUTRAL with X < 0 gets one pooled
  extension.
  - It is a BA/PM delivery call, flagged as cheap to reverse. Route it to the owner if you read it as a requirement
    change.
  - Why not S1: S1 would keep the carve-out for good on a NEUTRAL reading.
- **`EPIC-008`:** table row 9, one dated Scope line, S3 under § Ship rules, and M2 names S3.
- **For the Orchestrator:**
  - `ABC-207` shares `src/evaluate.ts` with `ABC-215`. The default order is `ABC-215` first (P2 over P3), and the pick
    is yours.
  - `EPIC-007` still lacks its dated `ABC-214` line (flagged by `bapm-cut-licence`; not in this brief).
  - The licence ADR (Architect, in flight) may name `ABC-215` as the end of the carve-out.
- **Not touched:** `src/`, `tools/`, `package*.json`, `LICENSE`/`NOTICE`, the ADRs, `EPIC-007`, the board, the trace,
  and the held security branch. No homelab or personal detail is written. In main's checkout only this record and
  its claim moved, and both are uncommitted.
- **Next free id: `ABC-216`.**

### Board card lines

`- [ABC-214] The repository is licensed Apache-2.0: verbatim LICENSE, NOTICE, "license": "Apache-2.0" in package.json; the CC BY-SA 3.0 evaluation tables carved out (path A)  (owner: software-engineer; before merge, the Architect's licence ADR accepted by the owner, size: XS, priority: P1, epic: EPIC-007 (post-close addition), since: 2026-10-24, DoR 10/10 — Ready; cut in \`bapm-cut-licence\` (\`…efbbb9ee\`), amended to path A in \`bapm-ABC-214-path-a\` (\`…c8dc129c\`) on owner word \`…fb0468ff\` (OD-214-1 = A). LICENSE sha256 cfc7749b…3d30 (11 358 B); package.json + lock root 1/1 each, private stays true; NOTICE copyright 2026 + kit MIT + CC BY-SA carve-out of 7 arrays, 0 @ / 0 /Users/; +2 header comment lines in src/evaluate.ts (transpile identity, A6); +1 armed value pin in ABC-042 A10. ABC-205-as-built keeps the list at 7 (pre-read). ABC-041 (a) → short Security/NFR hop; UAT waived by measurement. 0 executable lines. Re-derive follows as ABC-215)`

`- [ABC-215] The evaluation's material values and piece-square tables are our own, each made by a stated rule, and the CC BY-SA 3.0 carve-out leaves NOTICE and the src/evaluate.ts header  (owner: software-engineer, after Architect/Design (rules + moved-pin probe), size: L, priority: P2, epic: EPIC-008, since: 2026-10-24, DoR 9/10 — Backlog until ABC-214 merged, ABC-205 Done or closed, ABC-204 Done; cut in \`bapm-ABC-214-path-a\` (\`…c8dc129c\`) on owner word \`…fb0468ff\`. Arrays = the carve-out's list at base (7 today); rule in comment + rebuild test; 0 michniewski/by-sa in evaluate.ts and NOTICE; relations unedited; pins only by ADR-0028 d2 / oracle / ADR-0034, ADR-0026 levels → STOP; G1 ≥ 54/58, G2 ≤ 1 100 ns, G5, G6, G8, G9, G10; D: S3 (not LOSS). No security hop expected; UAT owed (QE signs))`

### Trace rows (10 cells, header order)

| ABC-214 (bapm-cut-licence; amended bapm-ABC-214-path-a) | The repository is licensed Apache-2.0: verbatim LICENSE, NOTICE, "license": "Apache-2.0" in package.json; the CC BY-SA 3.0 evaluation tables carved out (path A) | EPIC-007 (post-close addition) | licence | none moves; ABC-041 (a) fires (Security/NFR short hop); ADR-0036 b1/b2/c do not; LIC-PUB-1 (owner); supersedes ADR-0044 D13 / EPIC-007 M10 via the Architect's licence ADR (14 drift rows); OD-214-1 = A (…fb0468ff) | grugops/bapm-cut-licence @ 25223d72; grugops/bapm-ABC-214-path-a @ 5f0e21ef (records only)<br>plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md<br>notes …9475c6d2, …efbbb9ee, …b8af3e18, …c8dc129c | — | expected WAIVED by measurement (A6 transpile identity) | — | path A → Ready (XS, P1, DoR 10/10) |
| ABC-215 (bapm-ABC-214-path-a) | The evaluation's material values and piece-square tables are our own, each made by a stated rule, and the CC BY-SA 3.0 carve-out leaves NOTICE and the src/evaluate.ts header | EPIC-008 | — | G2 ≤ 1 100 ns; G6 depth ≥ 6 and ≥ base; G1 ≥ 54/58; ADR-0026 levels and NFR bounds not moved (STOP); ship rule S3; closes LIC-PUB-1 / OQ-214-4 at the tip | grugops/bapm-ABC-214-path-a @ 5f0e21ef (records only)<br>plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md<br>notes …b8af3e18, …c8dc129c | — | owed (production lines); QE verdict signs | — | cut → Backlog (L, P2, DoR 9/10; held by ABC-214 merge, ABC-205, ABC-204) |
