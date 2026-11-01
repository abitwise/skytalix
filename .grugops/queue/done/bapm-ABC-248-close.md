---
subtask: bapm-ABC-248-close
role: ba-pm
ref: .grugops/context/bapm-ABC-248-close/
branch: new grugops/bapm-ABC-248-close from main (worktree .claude/worktrees/bapm-ABC-248-close)
width: records only (no vitest, no engine, no games). qe-qehop-growth holds the host for timing.
---
# BA/PM: close ABC-248 and fold its QE gaps (records only)
## Read
- ABC-248's page; .grugops/queue/done/qe-ABC-248.md and se-ABC-248.md; notes under .grugops/context/qe-ABC-248/ (decision …cf9bdabf, findings …b519324e) and se-ABC-248/.
- ADR-0046 § BA/PM ruling 2026-10-31 (your own section) and § Addendum 2026-10-31.
## Do
1. Page close: front matter done/Done (it reads column Backlog today), `closed:` line, CLOSED block (QE PASS_WITH_GAPS …cf9bdabf; merged ef4cd095; G8 H 9.09 s / B 9.37 s; UAT waived).
2. QE-248-a (MEDIUM): fix ruling 6 / A10's `-t` form (regex-escaped brackets; the check is "4 passed", not exit 0) on the page and as a dated line in ADR-0046's BA/PM ruling section. If condition 4's Architect text also needs it, name it as owed to the Architect.
3. SE-248-b / QE-248-b (INFO): record whether a step move on a row whose kills depend on search depth needs an Architect reading of "interval" first; if you add a condition, add it as a dated ruling line.
4. QE-248-c (LOW, QPLY4 survives the whole lane; pre-existing): cut a ticket (XS/test-only if it is) or fold with a named carrier.
5. QE-248-d (INFO, QPARITY likely equivalent): record. QE-248-e/f/g: record or close.
6. EPIC-010 / ADR-0046 tranche 2: mark tranche 2 delivered (dated line) where the tranche is tracked.
## Fences
- plans/tickets, plans/epics, and ADR-0046's BA/PM ruling section only. No board, trace, src/, tools/, data/, AGENTS.md. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-ABC-248-close`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, BA/PM. Done, records only. Branch `grugops/bapm-ABC-248-close` (worktree `.claude/worktrees/bapm-ABC-248-close`, from `main` `37a93b76`). Records commit `d12ac18a`. Nothing run, built or timed (`qe-qehop-growth` holds the host). Not pushed, not merged. No board, trace, `src/`, `tools/`, `data/` or `AGENTS.md` edit.**

- **1. Page close.** `ABC-248` front matter `done` / `Done`, a `closed:` line, and a CLOSED block: QE PASS_WITH_GAPS `…cf9bdabf`, merged `ef4cd095` (code `71700836`), `G8` H 9.09 s / B 9.37 s, UAT waived.
- **2. QE-248-a (MEDIUM), fixed.** Ruling 6 is struck and replaced with the escaped one-line command (`-t "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"`). The check is "4 passed", not exit 0. A10 carries a dated reading. The same fix is a dated line in `ADR-0046` § BA/PM ruling 2026-10-31, plus a general rule for any `[deep, …]` `-t`. **Owed to the Architect (LOW):** a co-edit of condition 4's unescaped text in § Addendum 2026-10-31.
- **3. SE-248-b / QE-248-b, ruled.** Condition 2 is met as written for A4-a2 (40 → 4; time-blind, no depth asserted, 8 = 8), so it stands. No Architect reading is owed now. A dated floor binds later R4 step moves: a depth-sensitive row records depth, nodes and in-search node checks at both steps, and if it has fewer than 2 checks at the candidate step, its step holds until the Architect rules condition 2's unit.
- **4. QE-248-c (LOW), cut as `ABC-249`** (XS, P3, test-only, `EPIC-010`, DoR 10/10, column Backlog, `Backlog → Ready` recommended). It is one `src/engine.test.ts` row: a position that stood exactly twice before the root is met at ply ≥ 4, off the path, so `QPLY4` turns the lane red. The row's cost is ≤ 100 ms. If no fixture fits, the SE stops.
- **5. Closed:** QE-248-d (`QPARITY` likely equivalent, no ticket), QE-248-e, QE-248-f, QE-248-g, SE-248-c, SE-248-d. P-2 is closed. QE-244-a stays open as written.
- **6. Tranche 2 delivered:** a dated line in `ADR-0046` § BA/PM ruling 2026-10-31; `EPIC-010` FOLDED block, row 23 Done, row 24 `ABC-249` added. **Owed to the Architect (LOW):** `ADR-0046` § Status still reads "tranche 2 is OPEN".
- **Owed to the Orchestrator:** `ABC-249`'s board row and its `Backlog → Ready` move; its pull order (recommended before `ABC-233`/`236`/`237`/`238`); the trace render from the artifacts note's refs.
- **No owner word is owed.**
- **Notes** (task `bapm-ABC-248-close`, contextRoot = worktree; 3/3 read back): decision `…82916ae5`, artifacts `…b1e3b7e7` (observation: an `artifact-ref` needs a `gate_run`, and this hop has none), owed `…305c1830`.

### Trace row (10 cells, header order)

| ABC-248 (close) / ABC-249 (cut) | ABC-248 page closed; ADR-0046 tranche 2 delivered; ruling 6 / A10 `-t` escaped, check "4 passed" (QE-248-a); SE-248-b met as written plus a depth floor; ABC-249 cut from QE-248-c (QPLY4) | EPIC-010 | ADR-0046 § BA/PM ruling 2026-10-31 (dated 2026-11-01); ADR-0054 decision 3 (ABC-249) | NFR-008 MET at qe-ABC-248 (G8 H 9.09 s); ABC-249: row ≤ 100 ms, G8 ≤ 10 s | grugops/bapm-ABC-248-close @ d12ac18a: plans/tickets/ABC-248-…, plans/tickets/ABC-249-… (new), plans/epics/EPIC-010-…, memory-bank/50-decisions/ADR-0046-… (records only) | none run (records only) | ABC-248: waived (0 production lines), QE verdict signed; ABC-249: n/a | — | ABC-248 closed (Done); ABC-249 Backlog, DoR 10/10, Ready recommended |
