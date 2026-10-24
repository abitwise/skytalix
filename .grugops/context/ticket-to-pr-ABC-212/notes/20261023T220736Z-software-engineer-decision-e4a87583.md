---
id: 20261023T220736Z-software-engineer-decision-e4a87583
kind: decision
by: software-engineer
at: 2026-10-23T22:07:36Z
verified_by: 
confidence: high on the build; STOP open on 8 unlicensed rows
refs:
  - ABC-212
  - EPIC-004
  - ADR-0045
  - ADR-0044
  - NFR-004
  - NFR-008
  - 8e101313
  - c735577f
  - grugops/ABC-212
  - arch-design-ABC-212/20261023T215005Z-architect-design-decision-d2c68ace
  - arch-design-ABC-212/20261023T215005Z-architect-design-observation-2146d8c6
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
supersedes: 
seal: sha256:8f6cc8a4b397ca2bfecc467086823686457a8a9624d54ffb96a9ddb56e1f55fb
---

# ABC-212 built to the Design ruling and ADR-0045 § AMENDMENT 2026-10-24; STOP to Architect on 8 unlicensed reds

Software Engineer, task `ticket-to-pr-ABC-212`, branch `grugops/ABC-212` from `main` `c735577f`, code commit `8e101313`.

## The build (shape (i), no departure)
- `src/levels.ts`: `LEVELS[6] = { 5 000, 0 }`, `LEVELS[7] = { 30 000, 0 }`, `HARDEST_LEVEL` 7; `EASIEST_LEVEL` 1 and `DEFAULT_LEVEL` 5 unchanged; 1–5 unchanged. Header re-written to the amendment.
- `src/engine.ts`: `HARD_CEILING_MS` 5 000 → 32 000, one line plus comments. `deepen`'s `Math.min` and the level layer's blunder clamp unchanged.
- `src/cli-options.ts`: words `6`, `7`; `Difficulty` 1..7; `--difficulty needs one of 1|2|3|4|5|6|7`.
- `src/cli.ts`: usage `[--difficulty 1|2|3|4|5|6|7]`.
- `src/uci-session.ts`: `min`/`max` and the "takes an integer" text read `EASIEST_LEVEL`–`HARDEST_LEVEL`; `:211` bare-`go` G unchanged in code (comment added); D5 latency (≈5/7/32 s) documented in the header.
- `src/startup-questions.ts`: no edit; the question is built from the accepted words.

## SE calls inside the ruling
- A9 rows use step `Math.floor(G / 30)` (an integer, so the info `time` parses; `G / 30` gave `1033.33…`).
- `ceiling(L)` is the test-local `CEILING_MS` table in `src/levels.test.ts`; the clause-B row also asserts the margin ≥ 2 000 and `max(CEILING_MS) === HARD_CEILING_MS`.
- New coverage went into NEW rows (ABC-212 A1, A6, A7, A8, A9, A4-deep), not into pins outside the list.

## STOP (brief: any other existing test that goes red)
Eight existing rows outside A13 + ruling 4 go red at head and are NOT edited (see the observation note for the exact rows and the one-line edit each needs). The build is otherwise complete; licensing those eight is one small SE follow-up.
