---
id: 20261031T070000Z-agents-md-scribe-decision-38f0e378
kind: decision
by: agents-md-scribe
at: 2026-10-31T07:00:00Z
verified_by: 
confidence: high: records only; every figure read from ADR-0052 D4/D6/D8, secnfr-ABC-221 and qe-ABC-221 sealed notes and from src/engine.ts:160; nothing run, built or timed
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
seal: sha256:331353f361b409b3968a9955c14dbea3a5b498931deee31855654d4dcab38996
---

# AGENTS.md updated for uci-clock-mode (ABC-221 merged): TimeMode line carries three values; the A10 deep-lane line is folded into the existing UCI session lane line

Records only, branch `grugops/scribe-agents-md-clockmode` from `main` 164a70c1. Two lines of `AGENTS.md` changed (Commands), no other file.

## Line 1, UCI time mode (Dev / run)
- Now names ABC-220/221 and ADR-0052, and the three values `level|simple-tournament|uci-clock-mode` (default `level`).
- `simple-tournament`: fixed T = 22 s, `min(T, C)` under a clock C (unchanged text).
- `uci-clock-mode`: spends `min(59.5 s, C)`, ceiling 60 s (ADR-0052 D4).
- Both ignore `Skill Level`. `HARD_CEILING_MS` = 60 000 (ADR-0052 D6; `src/engine.ts:160`, read).
- The `isready` / `stop` one-budget-late caveat stays.

## Line 2, UCI session deep lane (Test)
- The ABC-221 A10 row (a child, 3 x 59.5 s) is named on the existing `src/uci-session.test.ts` lane line rather than as a new line, because the command is the same file and the same `ENGINE_DEEP=1` spelling.
- One-row form added: `-t "ABC-221 A10"`. The filter is the form QE ran (qe-ABC-221 observation b348899a, there spelled `node_modules/.bin/vitest`); the `npx vitest run` spelling is the lane's existing one. I did not run it.
- The ADR-0052 D8 spawn rule (2026-10-31) is carried in one clause: `ENGINE_DEEP` only, sync, argument array. The rule's third condition, no delivery file, is left in the ADR.

## Bytes
`AGENTS.md` 18 176 B before, 18 421 B after (+245). Budget about 18 432 B: inside by 11 B. A first draft read 18 499 B and was trimmed.

## Not done
- No command was run, so none was re-verified. Both commands are the ones already in the file, plus the QE-run `-t` filter.
- The pointer line `memory-bank/90-agents-md-command-log.md` is not touched (a different file, fenced out).
