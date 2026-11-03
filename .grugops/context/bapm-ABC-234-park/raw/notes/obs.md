# bapm-ABC-234-park checks: each page line was read against `arch-ABC-234` `…a4ed96aa` § 5, `…ffe76d35` and `ADR-0065` (on `main` at `32b807c7`) before editing; the owner ask and park ruling are read from `board.md` line 2 at `32b807c7`; no sealed Orchestrator note for them exists in `orch-2026-10-30a`

- Figures copied, not derived: S1m d8 `search()` 0.9011 / 0.9428, `chooseMove` 0.9864 / 0.9548; d7 `search()` 0.8463 / 0.7671; intent rule +0.068 ply; Q1 reach 5.837 → 6.721 (+0.884; 128 deeper, 1 shallower), d8 `search()` 0.6782 / 0.3227, `chooseMove` 0.5876 / 0.2239, drift 96.26 % ≤ 25 cp, max 69 cp, mate 0/163, zugzwang 7/7, `G1` 54/58; S1m over Q1 `chooseMove` 0.961 / 1.095; effort M, 1–1.5 Engineer days.
- `Q-3K-9` was free (no occurrence in the repository's `.md` files before this task).
- Lines changed in `6a2e0ca2`: `ABC-234` page +54 / −6; `EPIC-011` +35 / −6. `plans/traceability.md` one appended row.
- Source gap: the Orchestrator's park ruling and its owner ask (2026-11-03) are recorded on the board and in the brief only; no sealed `orch-2026-10-30a` note carries them. The pages cite the board at `32b807c7`.
