---
id: 20261011T085631Z-ba-pm-decision-abc116-discharge-pointer-to-abc144-8842e860
kind: decision
by: ba-pm
at: 2026-10-11T08:56:31Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ABC-144
  - ABC-108
  - ABC-110
  - AR-N8SPAWN-DRIFT
  - ADR-0017
  - plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
  - 20261011T083621Z-architect-design-decision-ar-n8spawn-drift-discharge-repointed-to-lane-cpu-ticket-36088a35
supersedes:
---

# Item 2: `ABC-116`'s two discharge lines now name `ABC-144` § Scope 4. A pointer fold only

This note is hand-authored and unsealed.

- **What changed.** Two hunks, read with `/usr/bin/diff -U0` against the pre-edit copy: `@@ -124 +124,2 @@` (§ Out of scope) and `@@ -185,2 +186,3 @@` (§ Dependencies). Each now names `ABC-144` § Scope 4 as the holder of `AR-N8SPAWN-DRIFT`'s discharge. Each keeps a dated "re-pointed 2026-10-11 from `ABC-108`" (and `ABC-110` at :186) with the `ADR-0017` § Pointers 2026-10-11 citation, so the history stays readable.
- **Verified before pointing.** `ABC-144` § Scope 4 (page line 79) carries the discharge, folded from `…36088a35`. `ADR-0017` § Pointers 2026-10-11 (`:177`) re-points to "the lane-CPU P1 ticket", which is `ABC-144`. `ABC-110` is `Done` (front matter).
- **Not changed:** the front matter, the DoR (10/10), size `XS`, priority `P2`, the column, and the dated amendment section (`:294–295`, `:323`), which is history. Line 122's fence list still names `ABC-108` as not re-opened, and that is still true.
