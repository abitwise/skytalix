---
id: 20261021T132911Z-qe-e2e-observation-89fca9e3
kind: observation
by: qe-e2e
at: 2026-10-21T13:29:11Z
verified_by: 
confidence: high: each item read at head against its cited source (context-io.js lines, the cited notes, ADR-0038, grep counts); severities are QE's
refs:
  - ABC-164
  - plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md
  - AGENTS.md
  - grugops/ABC-164
  - grugops/qe-ABC-164
  - 49dc490c
  - e82a3798
  - 3971302c
  - 20261021T132050Z-agents-md-scribe-observation-41a428be
  - 20261021T132051Z-agents-md-scribe-decision-d9ab58b9
  - memory-bank/90-agents-md-command-log.md
  - memory-bank/70-runbook.md
  - memory-bank/60-progress.md
  - src/cli.test.ts
  - 20261021T120645Z-qe-e2e-decision-7b9ef6a7
  - 20261021T122000Z-orchestrator-decision-9fd3189b
  - 20261019T084500Z-orchestrator-observation-abc146-verdict-run2-reading-a5-4c1d8e27
  - 20261019T084831Z-architect-design-decision-adr0038-add2-reporter-verbose-b7e2c915
  - 20261019T090000Z-orchestrator-decision-abc166-a5-agents-md-ladder-comment-to-scribe-6a2f9d03
  - 20261021T131002Z-ba-pm-observation-d197dcbd
  - QE-164-a
  - QE-164-c
  - QE-164-d
  - QE-164-h
  - QE-164-i
supersedes: 
seal: sha256:a7a5f0ae4a76434ef8b701303fbaf3b419b136f7139c9f9b89aae592a74df982
---

# ABC-164 break attempts: O1-O3 true; two stale present-tense claims left in 90; live citations name the old file

- **O1 is true, and its wording beats the page's.** AGENTS.md says to pass "the `.grugops/context` of the checkout you work in (the default root is the plugin's own directory)". In the plugin writer (`grugops@grugops` 2.1.0, `scripts/context-io.js:55-56`), `DEFAULT_CONTEXT_ROOT = join(<plugin>, ".grugops", "context")`, and `admitAndAppend(task, note, body, contextRoot = DEFAULT_CONTEXT_ROOT, …)` takes a `<checkout>/.grugops/context` path. The page's O1 row says "the main checkout's". Worktree hops (this one included, per its brief) commit notes on their branch, so "the checkout you work in" is the correct rule. The page row still reads "main checkout's" (QE-164-c, INFO).
- **O2 is true.** QE-184-c in `…7b9ef6a7`:50 carries `--reporter=verbose` (or `--silent=false`) and "`CLAUDECODE` alone is not the switch". Line 38 has 6 children at the ABC-184 tip. `…9fd3189b`:26 requires a count >= 1. The paragraph sits inside § Real-engine CLI lane.
- **O3 is true.** Run 2's wall time is 40,823 s (`…4c1d8e27`:42); `…b7e2c915`:17 has "vitest 4.1.11's default reporter drops console.log" and "passed 17/17 … no score"; ADR-0038:18-21 has addendum 2 of 2026-10-17, route V, with route N "not built … the accepted fallback". The heap flag is the one-file shape (`…7c31d5e8`).
- **QE-164-a (LOW): stale present-tense claims in `90` that this pass made false and left in place.** (1) § Dev / run, end of the ABC-069 paragraph: "`AGENTS.md` carries the rules in the slot's own comment; this entry is their receipt." The slot now carries only a pointer; the rules are in the next paragraph. (2) § Regenerate the opening book: "Source files are not checked in. `AGENTS.md` carries the line and one fact". AGENTS.md no longer carries the book line (B12 MOVE). (3) Preamble "`AGENTS.md` keeps each command line plus the single most load-bearing fact" and Reader "the one-line-per-command index every role reads": now untrue for the three on-demand commands. Nothing is lost, but a Scribe reading (1) is told the wrong place for the slot rules. Fix: a records-only Scribe amend of `90`.
- **QE-164-d (INFO): 8 live citations in 4 memory-bank files still name `AGENTS.md` § <moved heading>**: `70-runbook.md:83` (§ Branching model); `60-progress.md:167, 335, 464, 974`; `ADR-0018:48, 157`; `ADR-0037:561`. Each resolves in one hop through AGENTS.md § Standing rulings, whose pointer line names all five headings, and `45` keeps the headings verbatim. The page fences memory-bank edits to its own files. The runbook line is the only live operational one.
- **QE-164-h (INFO): stale test comment.** `src/cli.test.ts:2242` says AGENTS.md "carries 13 further closers after this slot's own"; at head it is **8**. No assertion depends on it, and the argument (end >= 0 is reachable) still holds. The Scribe and BA/PM (`…d197dcbd`) flagged it; it is an Engineer matter.
- **QE-164-i (INFO): Scribe note error.** `…d9ab58b9` ruling 3 says "Seven operative bullets"; § Standing rulings has **6**. Every listed sentence is still present.
- **Tried and held:** no slot option (`--colour`, `--difficulty`, `--ascii`, `--unicode`) is named anywhere new (the only `+` lines naming "Dev / run" are the slot pointer and § Memory bank); the `Dev / run` slot is exactly one and closes before the next `\n- `; every lane-table heading matches 1; there is no `npx vitest` in the Standing rulings, the pointers or O1; `main` merges in cleanly.
