---
id: 20261031T070000Z-agents-md-scribe-observation-fb8ed12e
kind: observation
by: agents-md-scribe
at: 2026-10-31T07:00:00Z
verified_by: 
confidence: high: byte counts by wc -c on the committed file; nothing else measured
refs:
  - scribe-agents-md-clockmode
  - ABC-221
  - EPIC-009
  - ADR-0052
  - ADR-0045
  - ADR-0044
  - NFR-004
  - secnfr-ABC-221
  - qe-ABC-221
  - arch-ABC-221-records
  - 6caa0f17
  - AGENTS.md
supersedes: 
seal: sha256:eb460bb29aa36e6bca5a91053dd19a05e9121649d68ce4a25d9a481d28a46856
---

# scribe-agents-md-clockmode: byte budget, 18 176 B to 18 421 B, and what was trimmed to fit

- Before: 18 176 B (`wc -c AGENTS.md` at 164a70c1). After: 18 421 B. Budget about 18 432 B, so 11 B spare. Cap 32 KiB, far off.
- The first wording read 18 499 B (67 B over). Trimmed: the spawn-rule clause shortened, "a child, three 59.5 s searches" to "3 x 59.5 s", "is 60 000" to "= 60 000", "default `level` is unchanged" to "default `level`", "under a 60 s ceiling" to "ceiling 60 s".
- The line "default `level` is unchanged" lost the word "unchanged"; the default is still stated.
- The next AGENTS.md addition has 11 B of room. A larger one must trim something else first.
