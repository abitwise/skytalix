---
subtask: arch-g8-headroom
role: architect-design
ref: .grugops/context/arch-g8-headroom/
branch: new grugops/arch-g8-headroom from main 14c8aafa
width: records + light reads (an SE runs npm test beside you; no timed reads)
---
# Architect: NFR-008 default-lane headroom is 0.10 s — how do we win it back? (QE-229-a MEDIUM; SEC-REBASE-b LOW)
## Read
plans/nfr-catalog.md NFR-008 (+ re-base to oeselg-devl), ADR-0035 (load1 ≤ 8 gate), ADR-0027 (virtual clock), qe-ABC-229
`…0b7fd4f6` (G8 9.90 s base and head; per-file cost; src/uci-session.test.ts ≈ 2.0 s/run since ABC-220), qe-ABC-220 A12/G8, and
the queued tickets that add default-lane rows: ABC-243, ABC-242, ABC-221.
## Do
- Rank the default lane's cost by file from the QE records (do not time anything yourself).
- Options: (a) make slow rows cheaper with no coverage loss (e.g. ABC-220's uci-session rows — why ≈ 2 s on a virtual clock?),
  (b) move named rows to an opt-in lane (say which, and what coverage the default lane then loses), (c) re-read the bar on the 24-CPU
  reference (SEC-REBASE-b: does load1 ≤ 8 still mean what it did on 8 cores?), (d) raise the 10 s level — owner's call only.
- Recommend one, with a target (e.g. ≤ 9.3 s) and the ticket(s) to cut. If (d) or an NFR bound moves, name the owner question.
## Fences
Records only (ADRs, your notes). No src/, tools/, data/. Run no timers or benchmarks. No board edits. Never push/force/amend/rebase/merge
into main. No host paths. Draft a seal script (context-io admitAndAppend only) if sealing needs node. Never `while pgrep -f` loops.
## Publish
Notes (task `arch-g8-headroom`), commit, `## Result` here, brief + claim to done/.
