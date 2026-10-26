---
id: 20261026T042539Z-architect-design-decision-2aefc52c
kind: decision
by: architect-design
at: 2026-10-26T04:25:39Z
verified_by: 
confidence: high: records only; each line checked read-only against main 43c5aca4 (git show/ls-tree/log/grep); no run
refs:
  - ABC-042
  - ABC-168
  - EPIC-003
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - EPIC-007
  - EPIC-008
  - memory-bank/30-architecture.md
  - arch-records-arch-page/20261026T042038Z-architect-design-observation-5302a6ba
  - orch-2026-10-26l
  - grugops/arch-records-arch-snapshot
  - 825b21d1
  - cb6a83da
  - 43c5aca4
supersedes: 
seal: sha256:c87e30f5cf8e4e0e5c2f9c36f25ef698bcb1ff7a3a2cd46b222d1028fcbffdb7
---

# Architect/Design: `30-architecture` gets one dated snapshot notice under the title, and the 3 stale lines from …5302a6ba get dated corrections. Original text kept; nothing else moves

Task `arch-records-arch-snapshot` (Orchestrator `orch-2026-10-26l`). Branch `grugops/arch-records-arch-snapshot`
is cut from `main` `43c5aca4`, and the records commit is `cb6a83da`. Input: this role's
`arch-records-arch-page/…5302a6ba`. Each line was checked read-only against `main` before it was written.

## Written (`memory-bank/30-architecture.md`)
0. **Header, line 2 (new):** a dated "Snapshot notice" line. The body is the 2026-08-12 as-built snapshot plus dated
   corrections; for any module, command or count the current truth is the code on `main` plus `AGENTS.md`; a full
   as-built re-pass is planned for `EPIC-008` close. Not an `_Updated` line, so it is not read as a new as-built date.
1. **§ System context, "no `main`, `exports` or `bin`":** `package.json` on `main` has `bin` `skytalix: dist/uci.js`,
   added in `825b21d1` (`ABC-168`). `git log -S` finds no `"main"`, `"exports"` or `"dependencies"` key ever added,
   and `private` is true. Dated: the `bin` part is false, the rest holds.
2. **§ System context, "Two epics are built and merged":** the epic pages carry `status: done` for `EPIC-001`…`005` and
   `EPIC-007`, and `status: backlog` for `EPIC-006` and `EPIC-008`. The board's Done column holds the six done epics.
   This resolves …5302a6ba's `UNKNOWN - verify` on per-epic state.
3. **§ Key components, "Seventeen production modules":** `main` has 46 non-test `.ts` files in `src/`, still flat.
   Three are TEST-ONLY corpora by their headers; `virtual-clock.ts` states no production module imports it. The
   table and graph figures were not re-measured: `UNKNOWN - verify` until the re-pass.

## Not moved
- No other line, status, bound, value or pin. No `src/`, `tools/`, `package.json` or `AGENTS.md` edit. No board edit.
  No npm, vitest or timing run. The diff only adds words. The class scan of the added lines found 0 hits.
