---
id: 20261106T223014Z-orchestrator-decision-a9e7118e
kind: decision
by: orchestrator
at: 2026-11-06T22:30:14Z
verified_by: 
confidence: high
refs:
  - ABC-291
  - NFR-008
  - ADR-0075
  - qe-ABC-291/20261106T222838Z-qe-e2e-decision-5826dcf6
supersedes: 
seal: sha256:a3ebda9ec179b674720a443746488feca696f2488d2df5a9433d4e1d28ad682a
---

# NFR-008 UNRESOLVED on ABC-291: row move first, no re-read of this lane, no budget waiver

- K4 met at 1.0267, K5 met. NFR-008: H 9.30 s, H − B +0.155 s against ≤ +0.10 s. Not a void, not a miss. By H3, no game.
- **The bar stands.** The budget is a line of mine (…f30bd604 1), so I could move it, and I do not: …f40ce634 1 says waiving a sealed rule on a close figure is the wrong habit, and the twin reads the same way at +0.180 s. A re-read of the unchanged lane would be fishing.
- **Route:** a row move first, then a new graded read under a new note. arch-ABC-291-n8 tests this route and reads the supply. If supply cannot buy it, the budget goes to the owner as a named moved bar.
- **Host released;** the owner is told. His window was asked for games that did not start. W is not carried: it is asked again for the new read.
- **Monitor, ruled now, before any game:** the one steady monitor process, at about 28 % of one core, stood at my 22:05:54Z check and through his held window. It does not count as a busy foreign process at W's first-game check, by that class and count only. It adds no room for any other process. He may overrule this. The ruling is mine, made before any game result exists.
