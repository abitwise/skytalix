---
task: wave-2026-09-25
subtask: qe-recheck-ABC-105
role: qe-e2e
workflow: agent-factory/workflows/16-context-read-write.md
ticket: plans/tickets/ABC-105-qe-hop-detector.md
ref: .grugops/context/qe-recheck-ABC-105/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/qe-recheck-ABC-105
base: main @ 05a1f11d
---

# Subtask: QE pre-build investigation of `ABC-105` (the QE-hop detector). Re-check the ticket against today's repo. Build nothing.

Owner's word: "let QE investigate and re-check it". The ticket was cut 2026-08-17 at 38 `Done` rows and re-scored 2026-10-11; `Done` now holds ~131 rows. Your job is to say, from your OWN readings at `main` @ 05a1f11d, whether the page is still buildable as written, and exactly what is stale. Every number you state is measured, with the command.

Re-check, at minimum:
1. **The data premises.** Count `.grugops/context/*/notes/*.md`, those with front matter, those with `by: qe-e2e`, those with `kind: decision` + `by: qe-e2e`. Does front matter still parse with plain `String.split` everywhere (find any that would not)? Do QE notes still sit in folders naming their ticket (`qe-ABC-xxx`, `qe2-ABC-xxx`, `fix-…`, `uat-…`)? Name any folder form the four-condition rule would miss.
2. **The criteria against real data.** Hand-evaluate the rule (all four conditions, A5 normalisation) for: `ABC-061` (A1), `ABC-031`/`ABC-076` (A2), `ABC-062` with the `quality-gate-ABC-066-qe/` notes (A3, the false pass must still be reproducible by a refs-only rule), `ABC-072`/`ABC-073` (A9). Say whether each criterion's expected exit still holds.
3. **The sweep (A4) at today's tip.** Parse `## Done` line-leading `- [ABC-xxx]` rows only (state the naive `ABC-\d+` count too). Under the ticket's rule, list covered-by-qe-e2e, covered-by-security-nfr-substitute, and NOT covered, each by id, and classify each not-covered id from its board row (dropped / owner-close / UAT-waived-but-QE'd elsewhere / real miss). Check today's tickets (ABC-145/148/117/116, and fold hops like `bapm-fold-*`) are covered.
4. **The grandfather snapshot and cutover.** With ~131 `Done` rows, what does a snapshot "generated from the board as it stands when this lands" mean now; is the snapshot still the right mechanism, and how big?
5. **Constraints that moved since the re-score.** `AGENTS.md` is now 24,545 B (31 B headroom under 24,576 B) — A7 needs a paragraph there: can it go by pointer? `N8-LANE` per-file floor named on the page vs today's ADR-0035 / vitest 4.1 numbers. A8's `PERFT_DEEP=1` 32/32: do NOT run it (other hop in parallel); say only whether the criterion is still worded right. The `P2` demotion trigger: has the Orchestrator's Done routine recorded a manual `--ticket` check (read `memory-bank/`, `AGENTS.md`, the board conventions)?
6. **Testability.** Is each of A1–A9 testable by QE after a build, without a fixture standing in for the real ABC-062 data (Test note 1)?

Deliver: a typed `kind: decision` note with verdict **BUILDABLE AS WRITTEN / BUILDABLE WITH PAGE AMENDMENTS / RE-CUT NEEDED**, a gap register (id `QE-105-x`, severity, the line on the page, the measured reading, the suggested amendment for BA/PM), plus a `kind: evidence` note with the sweep table. Write the sweep helper as a scratch script outside the repo (it is NOT the deliverable tool; do not add `tools/grugops/qe-hop-integrity.js`).

## Fences
READ-ONLY on everything except your notes, one trace row at the END of `plans/traceability.md`, and a § QE re-check (2026-10-12) section appended to the ticket page; do NOT edit the page's criteria — amendments are BA/PM's. Do not touch `src/`, `tools/`, `AGENTS.md`, `plans/board.md`. Work in your OWN worktree (`git worktree add ../wt-qe-recheck-ABC-105 -b grugops/qe-recheck-ABC-105 main`). No `--force`, `-D`, `reset --hard`. Take no timing readings; run no test suite (not needed). Never merge or push. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/qe-recheck-ABC-105`, then at the end write FLAT files `.grugops/queue/done/qe-recheck-ABC-105.md` and `.grugops/queue/done/qe-recheck-ABC-105.claim.md` (not a directory); leave both uncommitted. Report: branch tip, verdict, each numbered item with its reading, and the gap register.
