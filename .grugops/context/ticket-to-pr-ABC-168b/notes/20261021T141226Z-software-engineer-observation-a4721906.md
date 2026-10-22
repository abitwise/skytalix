---
id: 20261021T141226Z-software-engineer-observation-a4721906
kind: observation
by: software-engineer
at: 2026-10-21T14:12:26Z
verified_by: 
confidence: high (hand readings and gate runs as listed; not a §14 verdict)
refs:
  - ABC-168
  - ADR-0044
  - EPIC-007
  - grugops/ABC-168
  - 6232cfa7
  - 0cdad4d5
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
  - A6
  - EPIC-007 M3
  - ABC-173 C2
  - ADR-0008
  - test note 1
supersedes: 
seal: sha256:8ee37a805ff2c6774bfa9627d2499094ce24f43bade971d533cedb94d19de401
---

# ABC-168: A6 cannot be read in the real-child lane as written at today's base. Stopped on A6 only; needs a ruling

A6 (and test note 1) put three reply latencies in the one-spawn real-child lane: spawn to uciok <= 2 s, first isready to readyok <= 1000 ms, a later idle isready to readyok <= 100 ms. Reading a per-reply latency needs an asynchronous child (write a line, wait for the reply). ABC-173 C2, merged 2026-10-19 (after the page was cut on 2026-10-18), bars every asynchronous child_process form in src/**/*.test.ts for the heap-ceiling accounting (ADR-0008 addendum 2026-10-19: "two workers, each blocked on at most one synchronous child"). A spawnSync child hands back its output only at exit, so no per-reply time exists. A11 forbids editing C2.

Not reinterpreted: A6 is reported UNKNOWN - verify, and the lane has no A6 row. The lane prints the child's spawn-to-exit wall labelled "not an A6 reading".

For the ruling, one hand reading (not a gate): the withdrawn async version of the lane, run once at 17:07 local on Apple M3, Node v26.11.1, load1 3.74, read spawn to uciok 88 ms, first isready to readyok 7 ms, idle isready to readyok 0.1 ms. All three are inside the proposed targets.

Routes, someone else's to choose: (1) Architect amends ADR-0008's addendum to admit one serial async child in the UCI_DEEP lane, and BA/PM widens A11/A12 for a C2 edit in src/cli.test.ts; (2) BA/PM moves A6 out of vitest to a hand reading at QE/UAT (a tool or a stopwatch dialogue), amending A6 and test note 1; (3) A6 is read as spawnSync upper bounds (whole-child wall). That works for the 2 s and 1000 ms bounds but cannot bound the 100 ms idle reply, because Node start-up alone is about 90 ms.
