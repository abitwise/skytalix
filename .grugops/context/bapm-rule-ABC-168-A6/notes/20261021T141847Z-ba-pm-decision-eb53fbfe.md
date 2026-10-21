---
id: 20261021T141847Z-ba-pm-decision-eb53fbfe
kind: decision
by: ba-pm
at: 2026-10-21T14:18:47Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - A6
  - A11
  - A12
  - EPIC-007
  - EPIC-007 M3
  - ABC-173 C2
  - ADR-0008
  - ADR-0008 § ADDENDUM 2026-10-19
  - ADR-0044 candidate row (i)
  - NFR-008
  - grugops/ABC-168
  - 2ed5469a
  - 6d840c0d
  - 20261021T141226Z-software-engineer-decision-c7c0a672
  - 20261021T141226Z-software-engineer-observation-a4721906
  - 20261021T141226Z-software-engineer-observation-c6c1358b
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
supersedes: 
seal: sha256:56ec01a6dc2545ef1b564bd3189a6a11805d5209f7ae38e366c590ba09623296
---

# ABC-168 A6 ruled: route (2), a single QE hand reading by an async probe outside src/ and vitest. C2, ADR-0008 and A11 are untouched. DoR still 10/10

Ruling. A6 leaves the UCI_DEEP lane. At the QE hop, QE runs one async probe once against `node src/uci.ts` on the tip under review, with default options. The probe lives in .grugops/context/qe-ABC-168/probe/, follows the <ctx>/probe/ precedent, and is run with plain node, never through vitest. The targets are unchanged: spawn to uciok <= 2000 ms, first isready to readyok (book load included) <= 1000 ms, idle isready to readyok <= 100 ms. The record holds the host chip, the Node version, load1 (first number of sysctl -n vm.loadavg, read just before the run), the tip sha and each number marked met or missed. Only one run counts; there is no re-run to pick a better one. A reply that has not arrived within 10000 ms is recorded as a "no reply" miss. A miss is reported, not trimmed: it goes to Security/NFR (candidate row (i)) and does not fail QE on its own.

Why route (2). ABC-173 C2 governs src/**/*.test.ts only, and the ADR-0008 heap ceiling governs vitest runs only (AGENTS.md lines 75-76), so neither is edited or waived. A6 was already "read once ... reported, not trimmed", which makes it a measurement of a proposed target.
- Route (1) is rejected. It reopens an addendum the owner accepted, and it breaks that addendum's Ruling 4 premise ("a worker and its child are never both busy"), all for a measure that is still proposed.
- Route (3) is rejected. It cannot bound the 100 ms idle reply, because Node start-up is about 90 ms (…a4721906), and it would split one measure across two instruments.
The SE's withdrawn-async reading (88 / 7 / 0.1 ms, Apple M3, load1 3.74) informed the ruling but is not A6's reading.

Page amended (dated 2026-10-21, citing …c7c0a672, …a4721906, …c6c1358b):
- the top blockquote;
- Scope 3 (the lane is spawnSync and reads no per-reply latency);
- A6 rewritten;
- A12 gains one clause: records under .grugops/context/ are not delivery files;
- test note 1 (A6 removed from the lane);
- a new test note 6 (the probe);
- a Dependencies line (the owner's M3 confirmation);
- the candidate row (i) instrument.
Unchanged: the targets, A11, Scope 6, size S, P1, and NFR-008 N8-SPAWN.

DoR re-scored at main 6d840c0d. Items 4, 5, 6, 7 and 10 were re-read. Result: 10/10. The column is not moved by this hop: the card stays In Development, and the move to In Review is the Orchestrator's once the Scribe's Scope 5 lands.
