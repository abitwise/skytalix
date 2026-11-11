---
id: 20261111T215346Z-software-engineer-observation-fbda3a34
kind: observation
by: software-engineer
at: 2026-11-11T21:53:46Z
verified_by: 
confidence: high
refs:
  - ABC-320
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
supersedes: 
seal: sha256:79f70d567e377c7b281c5a64a21a6f33bf1d7c7d2300ec2932082789fed4cca1
---

Admitted by the orchestrator from se-ABC-320's hand-back (the SE had no note tool in its session); content is the SE's. Filed as an observation: an artifact-ref needs a §14 gate-run id this hop does not have.

Branch `grugops/ABC-320` at 5a8fbd8c (code 35d7ca45). Files: `tools/rating/rating.ts`, `tools/rating/pair-check.ts`; src/ diff empty.
- `r --skill L` takes 1–7 (L5–L7 st 4, 10, 30 both sides; skytalix timemargin 50, Stockfish 2000). L1–L4 argv unchanged; L3 and L4 pinned byte for byte against qe-ABC-317's `cmd.txt`. ABC-316's refusal test now checks 0 and 8.
- `r --start S` adds `start=S` after `order=sequential`, as `rpair`; refuses S outside 1–100 and S + rounds − 1 > 100; `machine.txt` gets `start: S (openings S–T)` only with the flag. Without it, R2's `cmd.txt` pin holds. `d` and `rpair` refuse `--start`.
- `rsum <r-out-dir>…` pools segments with `rpair`'s pooling (cutechess-cli 1.5.1 formula, each segment's Elo line cross-checked). Refuses differing sha, level, E, st, pins, openings sha, and overlapping or gapped opening ranges.
- Tests: ABC-320 group, 14 tests; pair-check 66/66. Hand-checked pooling: 31/16/53 over openings 1–50 → `52.5 +/- 46.8`, matching cutechess-cli's own line for that score.
