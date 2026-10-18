---
id: 20261018T175600Z-qe-e2e-decision-abc170-uat-conducted-owner-word-owed-d19e6c57
kind: decision
by: qe-e2e
task: uat-ABC-170
at: 2026-10-18T17:56:00Z
verified_by:
confidence: high
refs:
  - ABC-170
  - ABC-167
  - NFR-005
  - QE-170-b
  - UAT-170-a
  - UAT-170-b
  - grugops/ABC-170
  - grugops/uat-ABC-170
  - 20261018T175300Z-qe-e2e-artifact-ref-abc170-uat-pack-5c8e21a4
  - 20261018T175400Z-qe-e2e-observation-abc170-uat-run-six-scenarios-b7a3f0d2
  - 20261018T175500Z-qe-e2e-observation-abc170-not-observable-until-abc167-and-a6-e4d07b39
  - 20261018T175550Z-qe-e2e-observation-abc170-gates-at-tip-a91f6c30
  - 20261018T174100Z-orchestrator-decision-owner-word-abc170-a6-timing-ok-uat-by-qe-7f3a9c14
  - 20261018T132300Z-qe-e2e-decision-abc170-verdict-pass-with-gaps-09d90757
supersedes:
---

# UAT `ABC-170` conducted: PASS_WITH_GAPS on the observable half. NOT accepted; the owner's word is owed

This note is hand-authored and unsealed. `human_admission` is `off`, so this is a `decision` by an agent and
never a stamp.

> **Read this first.** "The UAT run passed" means **an agent ran the scenarios and they came back green**.
> It does **not** mean the owner accepted `ABC-170`. Under `AGENTS.md` § Test and UAT authority, the owner's
> own word in session is the only `In UAT` signature. A green agent report is explicitly not that word. Until
> he gives it, `ABC-170` is **UAT conducted, owner's word owed**.

## Result: PASS_WITH_GAPS

| criterion | UAT verdict | basis |
|---|---|---|
| A1 | **PASS** | S3: `maxDepth 3` gives d3 equal to `search(p, 3)`; `maxDepth 1` gives d1 with a legal move; 32 sweep rows give min(N, unlimited). S6 through the seam |
| A2 | **PASS** | S4: 20 058 nodes, within 21 024; the discard holds against `search(p, d)` and against a `maxDepth d` run; `maxNodes 1` gives d1, legal; 12 sweep rows. S6 through the seam |
| A3 | **PASS** | S1: 288/288 equal to **today's engine** (main's `src/`), field for field. S2: levels and seam unchanged |
| A4 | **PASS (observable half)** | Caller-visible half: no hidden depth cap with no limit (S1; S3 and S5a). Text pins re-read at entry, green in the lane (`…a91f6c30`) |
| A5 | **PASS** | S5: clock first, depth first, nodes first, both limits, and the ceiling under `Infinity` |
| A6 | **OWNER-RULED, NOT MEASURED** | The owner's *"timing seems ok"* (`…7f3a9c14`). No timing reading was taken. No depth or time is quoted or estimated |
| A7 | **PASS** | The fence from the merge base lists exactly two files; the limb grep is empty (`…a91f6c30`). S2 shows the game's callers unchanged. `UAT-170-a` INFO on the literal command |

- **6 of 6 scenarios PASS, 401 of 401 checks**, twice and byte-identical, at `36e3a753` (`…b7a3f0d2`).
- **The gaps are what cannot be observed yet, not failures** (`…e4d07b39`). The UCI half, including
  `go mate N → maxDepth 2N−1`, is `ABC-167`'s. `A6` stands on the owner's word, not on a reading.
- **Defects found: 0.** There are two INFO items: `UAT-170-a` (the `A7` command after the main merge) and
  `UAT-170-b` (a hidden `maxNodes` default goes unseen here too, as with `QE-170-b`).

## The question the owner answers to sign

> **Do you accept ABC-170, the engine's optional `maxDepth` and `maxNodes`, on this UAT? 6 of 6 scenarios
> pass through the engine's API. `A6` stands on your "timing seems ok", unmeasured. The UCI half, `go depth`
> / `go nodes` / `go mate`, is left for ABC-167 to prove. Accept or reject?**

## What happens next (none of it is QE's)

- **Accept:** the Orchestrator transcribes the owner's word and owns the board move out of `In UAT`.
- **Reject:** the reason goes to the Orchestrator for routing.
- QE has not merged, has not pushed and has not moved the board. `src/`, `plans/board.md` and
  `plans/traceability.md` are untouched. The trace row is in the handoff.
