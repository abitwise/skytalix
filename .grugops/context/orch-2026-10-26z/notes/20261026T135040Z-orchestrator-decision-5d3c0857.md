---
id: 20261026T135040Z-orchestrator-decision-5d3c0857
kind: decision
by: orchestrator
at: 2026-10-26T13:50:40Z
verified_by: 
confidence: high
refs:
  - ABC-209
  - ADR-0025
  - ticket-to-pr-ABC-209/…fb730791
  - owner-word-2026-10-26b/…2ae5fc12
  - NFR-009
  - QE-207-g
supersedes: 
seal: sha256:8ba72278acef473af9a4edcc4f4dd8a72dde4fa7becd2dcdb01d63ba48cf653b
---

# ABC-209 built → In Review; qe-ABC-209 dispatched ALONE (one hop: gate + readings)

- **Accepted ticket-to-pr-ABC-209 (…fb730791, …94763b89, …b5537728, …3e3d0c55)** on grugops/ABC-209 @ bb6cf451 (code tip 954eeb35).
  - Production lines: +57/−12, all in the five Scope files. 0 pins moved.
  - Rows: 11 new (10 default + 1 ENGINE_DEEP). Tests: 2138/2138, 0 skips.
  - Frozen-clock counts: 8/8 equal across base, head, and head with a token.
  - NFR-009 probe: Δ 53 048 B, under the 1 MiB bar.
  - `src/cli.test.ts` is unchanged in the diff. Its one-launch row is held because the two memory rows share a single launch.
- **ABC-209 moves In Development → In Review** (1/3).
- **QE in one ALONE hop, not split as for ABC-208.** The ADR is already accepted (…2ae5fc12), so nothing gates the reading, and one hop avoids a second worktree, merge and audit. The hop covers:
  - a static re-check: A1–A5, the plants, the moved rows (none), the cli.test.ts one-launch row, and the NFR-009 game choice;
  - the gates;
  - G2, G5, G8–G11 and the 12 real-clock rows;
  - the pre-check: 8/8 must be equal (A1), and any difference is a STOP;
  - G6 under rule A (a regression guard here);
  - D (A6) under S1, with its one extension.
  This is ABC-209's single reading, and it is final.
- **Owner told:** the run starts now (~6–12 h, battery allowed, keep the host light).
- **QE-207-g still open (INFO):** the ALONE claim outlives the 30-min stale TTL. No sweep runs while it is held.
