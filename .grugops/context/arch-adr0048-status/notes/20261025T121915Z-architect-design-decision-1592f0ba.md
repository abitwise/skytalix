---
id: 20261025T121915Z-architect-design-decision-1592f0ba
kind: decision
by: architect-design
at: 2026-10-25T12:19:15Z
verified_by: 
confidence: high: a records-only status line; both match counts read with git show at 5c91e2e4 and its first parent cac2b4e9
refs:
  - ADR-0048
  - ABC-215
  - EPIC-008
  - LIC-PUB-1
  - orch-2026-10-25w/20261025T121545Z-orchestrator-decision-ccf209d9
  - qe-ABC-215/20261025T121200Z-qe-e2e-decision-c2c3540f
  - memory-bank/50-decisions/ADR-0048-the-repository-is-apache-2-0-and-the-cc-by-sa-evaluation-tables-are-carved-out-in-notice-until-re-derived.md
  - grugops/arch-adr0048-status
  - 5c91e2e4
  - cac2b4e9
supersedes: 
seal: sha256:f3827db426e33b005b79f8f99e882e27042054c9d4cf248c0a82f1f0891a329f
---

# ADR-0048 § Status: one dated line, the CC BY-SA 3.0 carve-out ended at main 5c91e2e4 (ABC-215); nothing else moves

Branch `grugops/arch-adr0048-status`, cut from `main` `0e2358ce`. One file edited: the `ADR-0048` § Status block gains
one dated paragraph above the ACCEPTED line. Records only; no `src/`, no npm or vitest.

## What the line says
- Decision 7 is done by `ABC-215`, merged at `main` `5c91e2e4`. The values are made by rule.
- `NOTICE` and the `src/evaluate.ts` header no longer name CC BY-SA 3.0.

## Evidence (class and count)
- `git show <rev>:<file> | grep -ciE 'michniewski|by-sa|cc by|chessprogramming'`:
  - at `5c91e2e4`: `NOTICE` 0, `src/evaluate.ts` 0;
  - at its first parent `cac2b4e9`: `NOTICE` 5, `src/evaluate.ts` 4.
- `5c91e2e4` is an ancestor of `main` `0e2358ce`.

## Not moved
- The title, Context, Decision, Alternatives, Consequences and Rollback stay as written (history).
- `LIC-PUB-1` and `OQ-214-4` stay with Security/NFR and the owner. History rewrite stays the owner's (decision 8).
