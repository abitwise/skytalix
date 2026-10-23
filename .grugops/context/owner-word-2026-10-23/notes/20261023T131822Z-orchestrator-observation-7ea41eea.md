---
id: 20261023T131822Z-orchestrator-observation-7ea41eea
kind: observation
by: orchestrator
at: 2026-10-23T13:18:22Z
verified_by: 
confidence: high
refs:
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
  - M1
  - M8(a)
  - RISK-EPIC007-01
supersedes: 
seal: sha256:485f707d2cb02f213bc70d16952c44ca56475f682560758638b80f0a286d1740
---

# cutechess-cli is on the host (owner-installed, built from source)

Owner, verbatim: *"I now installed cutechess-cli and ran makefile, it is located at "~/Projects/others/cutechess/cutechess""*

Read by the Orchestrator at 2026-10-23T13:18Z:
- Binary: `/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli` — Mach-O 64-bit arm64, executable.
- `--version`: `cutechess-cli 1.5.1`, Qt 6.12.0, macOS Tahoe (26.7.1)/arm64. Source checkout `5e84232b` (`v1.5.1-5-g5e84232b`).
- **Not on PATH**: `which cutechess-cli` prints nothing. The binary is invoked by absolute path.

Ruling (Orchestrator, protocol detail under delegation …5aaf7cec): the EPIC-007 trigger "`which cutechess-cli` prints a path" (`…b5f65536`) is met in substance by this absolute path; no PATH change is asked of the owner. The M1/M8(a) reading ticket pins this path and version. Routed to BA/PM to cut the XS agent-run QE reading ticket.
