---
subtask: bapm-epic007-licence-line
role: ba-pm
ref: .grugops/context/bapm-epic007-licence-line/
branch: new records branch grugops/bapm-epic007-licence-line CUT FROM main fb0a7703, worktree ../wt-bapm-epic007-licence-line
width: 1 of 3
---

# EPIC-007: the ABC-214 / ADR-0048 dated lines

## Do
- Apply the ADR-0048 drift rows owned by BA/PM (EPIC-007 M10 "private" reading etc.) and the dated ABC-214 post-close line. Done tickets' dated readings stay history (ADR-0048's dispositions).
- Records only: `git diff --stat fb0a7703..HEAD -- src tools package.json` prints nothing; paste it.

## Fences
- Only your worktree. No ADR edits, no board edits, no homelab detail. Never push, force, amend or rebase; never merge into main.

## Publish
- Seal notes (task bapm-epic007-licence-line). ## Result + trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done 2026-10-24 by BA/PM.** Branch `grugops/bapm-epic007-licence-line` @ `52d2def3` (worktree
`../wt-bapm-epic007-licence-line`, cut from `main` `fb0a7703`). Records only. Not merged, not pushed. Notes
(`bapm-epic007-licence-line`): observation `20261024T103013Z-ba-pm-observation-2e8129a0`, decision
`20261024T103013Z-ba-pm-decision-23f86304`. Both seals validate clean (0 faults).

`git diff --stat fb0a7703..HEAD -- src tools package.json` prints nothing. Files: the EPIC-007 page and the two notes
(3 files, +101 / -1).

- **Row 12, the acceptance box:** one dated paragraph. The private reading is superseded by `ADR-0048`
  (owner-accepted 2026-10-24, `…776bba9a`): Apache-2.0, with the tables carved out (path A, `…fb0468ff`). `ABC-214`
  builds it, and `ABC-215` (`EPIC-008`) re-derives later. It names the places it covers: the box, § v1 — in, the
  ticket-table `ABC-169` row, Q12 with its precondition, and the web-project boundary. Those stay as dated history.
- **The dated `ABC-214` post-close line:** a new box after the close box. `ABC-214` is `EPIC-007 (post-close
  addition)`. It reopens no measure and does not reopen the epic. The close box's "all 13 tickets … Done" stays as
  history. `ABC-214` is the 14th, and its state lives on the board. `ABC-215` is `EPIC-008`'s.
- **Row 11, M10:** a dated note on the M10 row. MET on `ABC-169` stays. `ABC-214` supersedes the target: after merge,
  `license` reads `"Apache-2.0"`, `LICENSE` and `NOTICE` are tracked, and `"private": true` stays.
- **Row 13, `RISK-EPIC007-07`:** fired at publication (`LIC-PUB-1`). It is disposed by path A: carved out now
  (`ABC-214`), re-derived later (`ABC-215`, `ADR-0048` decision 7). The original text stays.
- **Not touched:** frontmatter `status`/`column`, `src/`, `tools/`, `package*.json`, `LICENSE`/`NOTICE`, every ADR,
  the `ABC-214` and `ABC-169` pages, the board and the trace. No homelab or personal detail is written.
- **For the Orchestrator:**
  - At `fb0a7703`, `ADR-0048` § Status still reads PROPOSED. This page cites the owner word as the acceptance.
    `arch-accept-adr0048` records the status. Merge the two together, or this one after it.
  - The `ABC-214` page frontmatter still reads `status: ready`, `column: Ready`. The board holds its real state.

### Trace row (10 cells, header order)

| EPIC-007 (bapm-epic007-licence-line) | ADR-0048 rows 11-13 on EPIC-007 (M10 superseded by ABC-214; acceptance-box pointer; RISK-EPIC007-07 disposed by path A) and the dated ABC-214 post-close line | EPIC-007 | licence | none moves; ADR-0048 accepted by owner (…776bba9a); LIC-PUB-1 at the tip via ABC-214, re-derive ABC-215 | grugops/bapm-epic007-licence-line @ 52d2def3 (records only)<br>plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md<br>notes …2e8129a0, …23f86304 | — | — | — | records placed; epic stays Done (no reopen) |
