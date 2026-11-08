---
id: 20261108T171046Z-architect-design-observation-2476937b
kind: observation
by: architect-design
at: 2026-11-08T17:10:46Z
verified_by: 
confidence: high: each figure quoted from its named record or read from src/ as committed; nothing was run; every P1 figure on today's tree, the door's first h3h4 depth and today's reach UNKNOWN - verify
refs:
  - arch-ABC-284
  - ABC-284
  - ADR-0060
  - ADR-0060 § The 2026-11-08 look
  - ADR-0060 d1
  - ADR-0060 d8
  - ADR-0060 d9
  - R-283-LMR
  - ADR-0063 d11
  - ADR-0076 d10
  - ADR-0076 d13
  - ADR-0056
  - ADR-0056 D2
  - EPIC-011
  - NFR-008
  - NFR-005
  - NFR-009
  - 50ff9250
  - bba42fb7
  - orch-2026-10-30a/20261108T165653Z-orchestrator-decision-4d1e0382
  - arch-ABC-292-closed/20261108T093747Z-architect-design-decision-569849c4
  - arch-ADR-0060-reopen/20261102T153114Z-architect-design-decision-e17a23f4
  - arch-post-268/20261102T205950Z-architect-design-decision-1bc554fb
  - arch-next-pull/20261102T213500Z-architect-design-observation-d0f1a5fc
  - arch-ABC-283-accept/20261104T165453Z-architect-design-decision-10e69053
  - arch-bundle-1/20261104T205537Z-architect-design-observation-ed82b408
supersedes: 
seal: sha256:f9da1fad78ae0a3744862a46e462b2c2df3e17513845813818b00d68dbe25305
---

# arch-ABC-284 readings: what changed on `main` since P1's last probes, and what the records say about each row it missed. Nothing run; every figure quoted from a named record or read from `src/` as committed

Architect/Design, task `arch-ABC-284`, records only, on `grugops/arch-ABC-284` from `main` `50ff9250` (`src/` tree `bba42fb7`). No test, build, engine or probe was run.

## 1. The tree since P1's last two probes (both on `e72487e1`, 2026-11-02)
| merge | what it changed |
|---|---|
| `54dee3f2` E1 (`ABC-269`) | every evaluation value (tapered table) |
| `7b70e268` Q1 (`ABC-279`) | quiescence skips SEE-losing captures out of check |
| `58e90d07` `ABC-283` | history with K3 (max(0, h)), SEE ordering, root aspiration |
| `434fa171` bundle 1 (`ABC-303`) | M3 move-count pruning, depth 1–3, three-piece guard; countermove tier |
| `a6ae8227` W1 (`ABC-282`) | time use in the clock modes; fixed-depth frozen-clock reads unchanged (`ABC-282` A0-1) |
| `ABC-274`, `ABC-270`, `ABC-271` | structure only, value- and node-identical |

- `git log --first-parent main -- src/`: the last `src/` merge is `434fa171`; `main`'s `src/` tree is `bba42fb7`.
- **The door's d8 counts** (the shipped search, flat 1-ply LMR), from `src/search.bundle.test.ts` "`ABC-303` — the bundle's own counts at depth 8" (`SEARCH_DEEP`): `search()` kiwipete 311 546, position-6 163 523; `chooseMove` deepened to 8, 573 518 / 94 911. `src/engine.test.ts` `ABC-282` A0-1's all-on column agrees (573 518, 94 911). On `e72487e1` they were 888 786 / 1 262 046 / 1 306 981 / 391 451 (`ADR-0061` d9). Ratios: 0.35, 0.13, 0.44, 0.24.
- **Reach at 47 000 on the 190:** 5.837 on `e72487e1`'s door; 7.016 for C1 + M3 in `arch-bundle-1` `…ed82b408` (on `0cc9afd1` + patch). Not re-read on `main`: `UNKNOWN - verify`.
- **No P1 reading exists on any tree with E1, K3, SEE ordering, the countermove or M3** (`ADR-0060` § Status; `ABC-284`; `…3ec2b4cf`).

## 2. Each row P1 missed, and what the records say
| row | bar | readings on record | source |
|---|---|---|---|
| `A4` (a) `chooseMove` d8 position-6 | ≤ 0.85 | decision 1: 0.8020 (`4d1c0616`), 0.8699 (pre-P3 `main`), **0.8528** (`e72487e1`); **0.7749 over H1** on `e72487e1` (diagnostic, not pre-registered); J3 ≤ 0.7800 against `main`; J1, J2, J4 0.8787 / 0.8772 / 1.0104 against H1 | `ADR-0060` § Status; `arch-next-pull` `…d0f1a5fc` |
| `A3` 27 cp cap, `search()` d5 | ≤ 27 | decision 1: 16 (`4d1c0616`), **63** at position-6/g5h6 (pre-P3 `main` and `e72487e1`); **25 / 11 over H1**; J1–J4 69 cp in `chooseMove` at position-6/f3h4; PV −2 diagnostic: the 63 cp line comes from two-ply reductions at PV nodes | `ADR-0060` § Status; `…d0f1a5fc` |
| zugzwang 7 / 7, `zugzwang.004` d11 h3h4 | 7 / 7 | decision 1 kept it on `4d1c0616` (door already at d10) and on pre-P3 `main`; **lost on `e72487e1`** (g7f6 at d11, h3h4 from d12; the door from d11, 905 900 nodes); **lost over H1** (5 / 7, `.001` too); **lost in each of J1–J4**. Diagnostic (not pre-registered): "futility's shallow skips and the two-ply reductions together delay h3h4 by one ply" | `ADR-0060` § Status, `arch-post-268`; `…d0f1a5fc` |
| R-283-LMR same-depth floor, d5 → d5, the 287 | 0 / 190 `search()`, 0 / 188 `chooseMove` (a bar for a P1 re-open since 2026-11-04) | decision 1: **2 / 189** on `4d1c0616`, pre-P3 `main` and `e72487e1` (a report then); J1 3 / 194, J2 7 / 194, J3 7 / 194, J4 3 / 194 over H1; P1-over-H1 not reported | `ADR-0060` § Status and decision 8; `arch-ABC-283-accept` `…10e69053`; `…d0f1a5fc` |

- **`zugzwang.004` on `main` today:** `chooseMove` plays h3h4 at d11 with 376 038 nodes (`se-ABC-303-main` `raw/out/zug.jsonl`). The first depth at which today's door plays h3h4 is not on record: `UNKNOWN - verify`.
- **`zugzwang.004`'s FEN** `8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w` (`src/search.futility.test.ts`): white bishop and queen, black rook and queen. Each side has two non-pawn pieces, so `moveCountNode` (and the null move) return 0 there by the three-piece guard (`src/search.ts`). `futilityNode` has no material guard.
- **R-283-LMR's wording** (`…10e69053`): "A P1 re-open (`ABC-284`) reads d5 as the bar and d6 as a report, over the history table on `main`". `ADR-0060` decision 8 had the same-depth count as a report (2 / 189) and the one-ply-deeper floor (d4 → d5) as the bar. The later line governs; reading it as a report would loosen it.
- **The standing floor rows on `main`** (`src/search.bundle.test.ts`, `SEARCH_DEEP`): `ABC-283`'s and `ABC-303`'s same-depth floors read `search()` and `chooseMove` against the all-off doors. They stay on the shipped path under decision 6, so a build of decision 1 reads them directly.

## 3. The lane and the pins, from `src/`
- `NFR-008`: 9.085 s on QE's arms, `plans/nfr-catalog.md`; the per-change line ≤ +0.10 s (`…aab9afd1`).
- Deep pins a shipped-tree change reaches (`ADR-0076`'s table on the same `src/`): `ABC-282` A0-3 `D8` / `D7` / `D6` in `src/uci-session.test.ts`; A0-1 and A0-2 in `src/engine.test.ts`; `ABC-303`'s d8 counts in `src/search.bundle.test.ts`. D5's depth-2 `a1f6` row: `lateMoveReduction` returns 0 at the root and below remaining depth 3, so a depth-2 search reduces nothing.

## Confidence
High on every quoted figure, each from its named record or file. The first depth of `zugzwang.004` on today's door, today's reach and every P1 figure on today's tree are `UNKNOWN - verify`.
