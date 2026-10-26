---
subtask: arch-records-arch-snapshot
role: architect-design
ref: .grugops/context/arch-records-arch-snapshot/
branch: new grugops/arch-records-arch-snapshot from main, worktree ../wt-arch-records-arch-snapshot
width: 1 of 3 (records only — no npm, vitest or timing; no src/)
---

# memory-bank/30-architecture.md: snapshot header + the 3 known stale lines (last hop of this kind)

## Do
- Per Orchestrator `orch-2026-10-26l`:
  1. Add one dated header line under the title: the page body is the 2026-08-12 as-built snapshot plus dated corrections, and the current truth for any module, command or count is the code on `main` plus `AGENTS.md`. A full as-built re-pass is planned for EPIC-008 close.
  2. Add dated corrections for the 3 lines your `arch-records-arch-page/…5302a6ba` lists: line 24 "no `main`, `exports` or `bin`"; "Two epics are built and merged"; "Seventeen production modules". Check each against `main` first, by reading files only.
- No other line moves, and there will be no further line-by-line hops.

## Fences
- Only that page, your worktree and `<scratchpad>/arch-snap/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-records-arch-snapshot). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, records only.** Branch `grugops/arch-records-arch-snapshot` (worktree `../wt-arch-records-arch-snapshot`), cut from `main` `43c5aca4`. Commits `cb6a83da` (records) and `45072dac` (notes); tip `45072dac`. Not pushed and not merged.

All three lines were checked read-only against `main` (`git show`, `git ls-tree`, `git log -S`, `git grep`) before writing. Every original word is kept; the diff only adds words.
- **0. Header, line 2 (new):** "*Snapshot notice, 2026-10-26, by Architect/Design (task `arch-records-arch-snapshot`, Orchestrator `orch-2026-10-26l`): **the body of this page is the 2026-08-12 as-built snapshot plus dated corrections.** For any module, command or count, the current truth is the code on `main` plus `AGENTS.md`. A full as-built re-pass is planned for `EPIC-008` close.*" It is not an `_Updated` line, so it does not read as a new as-built date.
- **1. § System context l.24, "no `main`, `exports` or `bin`":** "*2026-10-26 (`ABC-168`): the `bin` part is no longer true. `package.json` has a `bin` (`skytalix`: `dist/uci.js`) since `ABC-168` (`825b21d1`), the same fact as the § Deployment posture line. Still true: `private`, no `main`, no `exports` and no `dependencies` key; nothing is published.*"
- **2. § System context, "Two epics are built and merged":** "*2026-10-26 (`EPIC-003`…`EPIC-008`): no longer true. Six epics are done: `EPIC-001` to `EPIC-005` and `EPIC-007` (`status: done` on each epic page, and each sits in the board's Done column). `EPIC-006` and `EPIC-008` are open (`status: backlog`). The code of `EPIC-003`…`EPIC-006` exists on `main`, for example `move-input.ts`, `search.ts`, `book.ts` and the `cli.ts` entry point.*" This resolves the `…5302a6ba` `UNKNOWN - verify` on per-epic state.
- **3. § Key components, "Seventeen production modules":** "*2026-10-26: the count is no longer true. `main` has 46 non-test `.ts` files in `src/`, still flat (`__snapshots__` still holds no `.ts`). Three of them are TEST-ONLY corpora by their own headers (`evaluate.mirror-corpus.ts`, `puzzle-corpus.ts`, `search.mate-corpus.ts`), and `virtual-clock.ts` says no production module imports it. The table and the graph figures below were not re-measured; see the snapshot notice at the top.*"
- **Open (LOW, Orchestrator to route):** observation `…cdc1fb61`. Board line 2 (`orch-2026-10-26l`) says the re-pass "is in the Backlog notes for EPIC-008 close", but no `## Backlog` row names it. Only that header line holds it. Suggested, not ruled: a Backlog line or an `EPIC-008` close item. Not edited (no board edits).
- **Empty diff:** `git diff --stat main..45072dac -- src tools package.json AGENTS.md` printed nothing. Class scan over the added lines and the notes: 0 hits. No board edit. No npm, vitest or timing run: only git, grep, file reads, the claim script and the note writer.
- **Notes** (task `arch-records-arch-snapshot`): `20261026T042539Z-architect-design-decision-2aefc52c` and `20261026T042539Z-architect-design-observation-cdc1fb61`.
  - Both were sealed by grugops 2.1.0 `admitAndAppend` with an explicit `contextRoot`, with 0 findings.
  - Both read back with `readContext` (2 notes). The index was rendered.
- **For the Orchestrator:** merge `grugops/arch-records-arch-snapshot` when ready. Per the ruling, no more line-by-line hops on this page.

### Trace row (10 cells, header order)

| 30-architecture snapshot notice (arch-records-arch-snapshot) | 30-architecture: dated snapshot notice under the title (body = 2026-08-12 as-built + dated corrections; truth = `main` + `AGENTS.md`; re-pass at EPIC-008 close) and 3 stale lines dated (l.24 `bin`; "Two epics are built"; "Seventeen production modules") | EPIC-001…EPIC-008 (status only), EPIC-007 (ABC-168) | ABC-168 | none moves | `grugops/arch-records-arch-snapshot` @ `45072dac` (on 43c5aca4)<br>30-architecture + notes …2aefc52c, …cdc1fb61 | records only: `git diff --stat 43c5aca4..HEAD -- src tools package.json AGENTS.md` empty; class scan 0 | — | — | records written; re-pass not yet a Backlog row (LOW, …cdc1fb61) |
